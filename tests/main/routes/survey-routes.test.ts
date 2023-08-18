import { type Account } from '@/application/entities'
import { ObjectId, type Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import app from '@/main/config/app'
import env from '@/main/config/env'
import request from 'supertest'

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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('publisher')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys/survey_id')
        .expect(403)
    })

    test('Should return 200 on load survey with valid accessToken', async () => {
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      const accessToken = await makeAccessToken()
      await request(app)
        .get(`/api/surveys/${res.insertedId.toString()}`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
