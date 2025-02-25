import { ObjectId, type Collection } from 'mongodb'
import { type User } from '@/domain/entities'
import { type Account } from '@/application/entities'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { RedisAuthenticatedUserAccountsRepository, RedisClient } from '@/infra/db/in-memory/redis'
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

const authenticatedUserAccounts = new RedisAuthenticatedUserAccountsRepository()

const makeAccessToken = async (role: Account.BaseDataModel.Roles): Promise<{
  accessToken: string
  accountId: string
}> => {
  const user = await userCollection.findOneAndReplace({}, {
    name: 'Luan',
    email: 'teste123@gmail.com'
  }, { upsert: true, returnDocument: 'after' })

  const account = await accountCollection.findOneAndReplace({}, {
    userId: user.value._id,
    password: await hash('123', 12),
    role
  }, { upsert: true, returnDocument: 'after' })

  const accountId = account.value._id.toString()

  const accessToken = sign({
    userId: user.value._id.toString(),
    accountId,
    willExpireIn: (Date.now() / 1000) + 180,
    role
  }, env.api.jwtSecret)

  await authenticatedUserAccounts.authenticate({
    ip: '::ffff:127.0.0.1',
    accountId,
    user: MongoHelper.mapOneDocumentWithId(user.value) as User.Model,
    accessToken,
    role
  })

  return {
    accessToken,
    accountId
  }
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await RedisClient.connect()
    await MongoHelper.connect(env.mongodb.url)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await RedisClient.disconnect()
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
      const access = await makeAccessToken('publisher')
      await request(app)
        .post('/api/publisher/surveys')
        .set('x-access-token', access.accessToken)
        .send(surveyRequest)
        .expect(204)
    })
  })

  describe('GET /publisher/surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/publisher/surveys')
        .send()
        .expect(403)
    })

    test('Should return 403 on load surveys with invalid accessToken role', async () => {
      const access = await makeAccessToken('basic_user')
      await request(app)
        .get('/api/publisher/surveys')
        .set('x-access-token', access.accessToken)
        .send()
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const access = await makeAccessToken('publisher')
      await request(app)
        .get('/api/publisher/surveys')
        .set('x-access-token', access.accessToken)
        .send()
        .expect(204)
    })
  })

  describe('GET /guest/surveys', () => {
    test('Should return 204 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/guest/surveys')
        .expect(204)
    })

    test('Should return 200 on load surveys without accessToken', async () => {
      await surveyCollection.insertOne(surveyToInsertOnDatabase)
      await request(app)
        .get('/api/guest/surveys')
        .expect(200)
    })
  })

  describe('GET /user/surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/user/surveys')
        .expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const access = await makeAccessToken('basic_user')
      await request(app)
        .get('/api/user/surveys')
        .set('x-access-token', access.accessToken)
        .expect(204)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      await surveyCollection.insertOne(surveyToInsertOnDatabase)
      const access = await makeAccessToken('basic_user')
      await request(app)
        .get('/api/user/surveys')
        .set('x-access-token', access.accessToken)
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
      const access = await makeAccessToken('basic_user')
      await request(app)
        .get(`/api/user/surveys/${res.insertedId.toString()}`)
        .set('x-access-token', access.accessToken)
        .expect(200)
    })
  })

  describe('GET /publisher/surveys/:surveyId', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/publisher/surveys/survey_id')
        .expect(403)
    })

    test('Should return 200 on load survey with valid accessToken', async () => {
      const access = await makeAccessToken('publisher')
      const res = await surveyCollection.insertOne({
        ...surveyToInsertOnDatabase,
        publisherAccountId: access.accountId
      })
      await request(app)
        .get(`/api/publisher/surveys/${res.insertedId.toString()}`)
        .set('x-access-token', access.accessToken)
        .expect(200)
    })
  })

  describe('GET /guest/surveys/:surveyId', () => {
    test('Should return 403 if survey not exist', async () => {
      await request(app)
        .get(`/api/guest/surveys/${new ObjectId().toString()}`)
        .expect(403)
    })

    test('Should return 200 on load survey', async () => {
      const res = await surveyCollection.insertOne(surveyToInsertOnDatabase)
      await request(app)
        .get(`/api/guest/surveys/${res.insertedId.toString()}`)
        .expect(200)
    })
  })
})
