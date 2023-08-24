import { type Account } from '@/application/entities'
import { type Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import env from '@/main/config/env'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection
let userCollection: Collection

const makeAccessToken = async (role?: Account.BaseDataModel.Roles): Promise<string> => {
  const user = await userCollection.insertOne({
    name: 'Luan',
    email: 'teste123@gmail.com'
  })
  const account = await accountCollection.insertOne({
    userId: user.insertedId,
    password: '123',
    role
  })
  const { id } = MongoHelper.mapInsertOneResult(account, {})
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: new ObjectId(id)
  }, {
    $set: {
      accessToken
    }
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey vote without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
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
          amountVotes: 0
        }, {
          answer: 'Answer 2',
          amountVotes: 0
        }],
        totalAmountVotes: 0,
        date: new Date()
      })
      const accessToken = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${res.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 2'
        })
        .expect(200)
    })
  })
})
