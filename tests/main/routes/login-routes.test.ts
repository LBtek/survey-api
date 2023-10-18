import { type Collection } from 'mongodb'
import { type User } from '@/domain/entities'
import { type AuthenticatedAccount, type Account } from '@/application/entities'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/in-memory/authenticated-user-accounts-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

let accountCollection: Collection
let userCollection: Collection

const authenticatedUserAccounts = new InMemoryAuthenticatedUserAccountsRepository()

const makeAccessToken = async (role: Account.BaseDataModel.Roles):
Promise<AuthenticatedAccount.UserAccount & {
  ip: string
  accessToken: string
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

  const accessToken = sign({
    userId: user.value._id.toString(),
    accountId: account.value._id.toString(),
    willExpireIn: (Date.now() / 1000) + 180,
    role
  }, env.jwtSecret)

  const ip = '::ffff:127.0.0.1'

  const authenticationData = {
    ip,
    accessToken,
    accountId: account.value._id.toString(),
    user: MongoHelper.mapOneDocumentWithId(user.value) as User.Model,
    role
  }
  await authenticatedUserAccounts.authenticate(authenticationData)

  return authenticationData
}

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
      const name = 'Luan'
      const email = 'teste123@gmail.com'

      const response = await request(app)
        .post('/api/signup')
        .send({
          name,
          email,
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)

      expect(response.body.accessToken).toBeTruthy()
      expect(response.body.username).toBeTruthy()
      expect(response.body.username).toBe('Luan')

      const user = await userCollection.findOne({
        name,
        email
      })
      expect(user).toBeTruthy()

      const account = await accountCollection.findOne({
        userId: user._id
      })
      expect(account).toBeTruthy()

      const userId = MongoHelper.mapOneDocumentWithId(user).id
      const accountId = MongoHelper.mapOneDocumentWithId(account).id

      const authenticatedUserAccount = await authenticatedUserAccounts.loadUser({
        ip: '::ffff:127.0.0.1',
        accessToken: response.body.accessToken,
        userId,
        accountId,
        role: 'basic_user'
      })
      expect(authenticatedUserAccount).toBeTruthy()
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const email = 'teste123@gmail.com'
      const password = await hash('123', 12)

      const user = await userCollection.insertOne({
        name: 'Luan',
        email
      })
      const account = await accountCollection.insertOne({
        userId: user.insertedId,
        password
      })

      const response = await request(app)
        .post('/api/login')
        .send({
          email,
          password: '123'
        })
        .expect(200)

      expect(response.body.accessToken).toBeTruthy()
      expect(response.body.username).toBeTruthy()
      expect(response.body.username).toBe('Luan')

      const { accessToken } = response.body
      const userId = user.insertedId.toString()
      const accountId = account.insertedId.toString()

      const authenticatedUserAccount = await authenticatedUserAccounts.loadUser({
        ip: '::ffff:127.0.0.1',
        accessToken,
        userId,
        accountId,
        role: 'basic_user'
      })
      expect(authenticatedUserAccount).toBeTruthy()
    })

    test('Should return 401 if not found user account', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'teste123@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })

  describe('GET /logout', () => {
    test('Should ', async () => {
      let { accessToken, user, ...rest } = await makeAccessToken('basic_user')

      let authenticatedUserAccount = await authenticatedUserAccounts.loadUser({
        accessToken,
        ...rest,
        userId: user.id
      })
      expect(authenticatedUserAccount).toBeTruthy()

      await request(app)
        .get('/api/logout')
        .set('x-access-token', accessToken)
        .send()
        .expect(204)

      authenticatedUserAccount = await authenticatedUserAccounts.loadUser({
        accessToken,
        ...rest,
        userId: user.id
      })
      expect(authenticatedUserAccount).toBeNull()

      /* --------------------------------------------------------------------------- */

      let loginResponse = await request(app)
        .post('/api/login').send({
          email: user.email,
          password: '123'
        })
      accessToken = loginResponse.body.accessToken

      await request(app)
        .get(`/api/logout?accessToken=${accessToken}`)
        .send()
        .expect(204)

      authenticatedUserAccount = await authenticatedUserAccounts.loadUser({
        accessToken,
        ...rest,
        userId: user.id
      })
      expect(authenticatedUserAccount).toBeNull()

      /* --------------------------------------------------------------------------- */

      loginResponse = await request(app)
        .post('/api/login').send({
          email: user.email,
          password: '123'
        })
      accessToken = loginResponse.body.accessToken

      await request(app)
        .get(`/api/logout/${accessToken}`)
        .send()
        .expect(204)

      authenticatedUserAccount = await authenticatedUserAccounts.loadUser({
        accessToken,
        ...rest,
        userId: user.id
      })
      expect(authenticatedUserAccount).toBeNull()
    })
  })

  describe('POST /logout', () => {
    test('Should ', async () => {
      let { accessToken, user, ...rest } = await makeAccessToken('basic_user')

      let userAccount = await authenticatedUserAccounts.loadUser({
        accessToken,
        ...rest,
        userId: user.id
      })
      expect(userAccount).toBeTruthy()

      await request(app)
        .post('/api/logout')
        .set('x-access-token', accessToken)
        .send()
        .expect(204)

      userAccount = await authenticatedUserAccounts.loadUser({
        accessToken,
        ...rest,
        userId: user.id
      })
      expect(userAccount).toBeNull()

      /* --------------------------------------------------------------------------- */

      let loginResponse = await request(app)
        .post('/api/login').send({
          email: user.email,
          password: '123'
        })
      accessToken = loginResponse.body.accessToken

      await request(app)
        .post('/api/logout')
        .send({ accessToken })
        .expect(204)

      userAccount = await authenticatedUserAccounts.loadUser({
        accessToken,
        ...rest,
        userId: user.id
      })
      expect(userAccount).toBeNull()

      /* --------------------------------------------------------------------------- */

      loginResponse = await request(app)
        .post('/api/login').send({
          email: user.email,
          password: '123'
        })
      accessToken = loginResponse.body.accessToken

      await request(app)
        .post(`/api/logout/${accessToken}`)
        .send()
        .expect(400)

      userAccount = await authenticatedUserAccounts.loadUser({
        accessToken,
        ...rest,
        userId: user.id
      })
      expect(userAccount).toBeTruthy()
    })
  })
})
