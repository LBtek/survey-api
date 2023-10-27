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

describe('Survey Vote Routes', () => {
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

  describe('PUT /user/surveys/:surveyId', () => {
    test('Should return 403 on save survey vote without accessToken', async () => {
      await request(app)
        .put('/api/user/surveys/any_id')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey vote with valid accessToken', async () => {
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com',
          numberOfVotes: 0
        }, {
          answer: 'Answer 2',
          numberOfVotes: 0
        }],
        totalNumberOfVotes: 0,
        date: new Date()
      })
      const accessToken = await makeAccessToken('basic_user')
      await request(app)
        .put(`/api/user/surveys/${res.insertedId.toString()}`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 2'
        })
        .expect(200)
    })
  })
})
