import { type Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { hash } from 'bcrypt'
import request from 'supertest'

let accountCollection: Collection
let userCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Luan',
          email: 'teste123@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      const user = await userCollection.insertOne({
        name: 'Luan',
        email: 'teste123@gmail.com'
      })
      await accountCollection.insertOne({
        userId: user.insertedId,
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'teste123@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'teste123@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
