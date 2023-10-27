import { type Collection } from 'mongodb'
import { type User } from '@/domain/entities'
import { type Account } from '@/application/entities'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/in-memory/authenticated-user-accounts-repository'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection
let userCollection: Collection

const surveyRequest = {
  question: 'Question',
  answers: [{
    answer: 'Answer 1',
    image: 'http://image-name.com'
  }, {
    answer: 'Answer 2'
  }]
}

const surveyToInsertOnDatabase = {
  ...surveyRequest,
  answers: surveyRequest.answers.map((a: any) => {
    a.numberOfVotes = 0
    return a
  }),
  totalNumberOfVotes: 0
}

const authenticatedUserAccounts = new InMemoryAuthenticatedUserAccountsRepository()

const makeAccessToken = async (role: Account.BaseDataModel.Roles): Promise<string> => {
  const user = await userCollection.findOneAndReplace({}, {
    name: 'Luan',
    email: 'teste123@gmail.com'
  }, { upsert: true, returnDocument: 'after' })

  const account = await accountCollection.findOneAndReplace({}, {
    userId: user.value._id,
    password: await hash('123', 12),
    role
  }, { upsert: true, returnDocument: 'after' })

  const accessToken = sign({
    userId: user.value._id.toString(),
    accountId: account.value._id.toString(),
    willExpireIn: (Date.now() / 1000) + 180,
    role
  }, env.jwtSecret)

  await authenticatedUserAccounts.authenticate({
    ip: '::ffff:127.0.0.1',
    accountId: account.value._id.toString(),
    user: MongoHelper.mapOneDocumentWithId(user.value) as User.Model,
    accessToken,
    role
  })

  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('POST /publisher/surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/publisher/surveys')
        .send(surveyRequest)
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('publisher')
      await request(app)
        .post('/api/publisher/surveys')
        .set('x-access-token', accessToken)
        .send(surveyRequest)
        .expect(204)
    })
  })

  describe('GET /user/surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/user/surveys')
        .expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken('basic_user')
      await request(app)
        .get('/api/user/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      await surveyCollection.insertOne(surveyToInsertOnDatabase)
      const accessToken = await makeAccessToken('basic_user')
      await request(app)
        .get('/api/user/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })

  describe('GET /user/surveys/:surveyId', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/user/surveys/survey_id')
        .expect(403)
    })

    test('Should return 200 on load survey with valid accessToken', async () => {
      const res = await surveyCollection.insertOne(surveyToInsertOnDatabase)
      const accessToken = await makeAccessToken('basic_user')
      await request(app)
        .get(`/api/user/surveys/${res.insertedId.toString()}`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
