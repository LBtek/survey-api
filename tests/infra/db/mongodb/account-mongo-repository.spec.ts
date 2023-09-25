import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { mockAddAccountParams } from '#/domain/mocks/models'
import { ObjectId, type Collection } from 'mongodb'
import env from '@/main/config/env'

let accountCollection: Collection
let userCollection: Collection

describe('Account Mongo Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const addData = mockAddAccountParams()
      const result = await sut.add(addData)
      expect(result).toBeTruthy()
      expect(result.userId).toBeTruthy()
      expect(result.accountId).toBeTruthy()
      const foundAccount = await accountCollection.findOne({ _id: new ObjectId(result.accountId) })
      expect(foundAccount.role).toBe(addData.role)
    })
  })

  describe('checkByEmail()', () => {
    test('Should return true if an account with the email already exists', async () => {
      const sut = makeSut()
      await sut.add(mockAddAccountParams())
      const exist = await sut.checkByEmail({ email: 'any_email@mail.com' })
      expect(exist).toBe(true)
    })

    test('Should return false if an account with the email not exists', async () => {
      const sut = makeSut()
      const exist = await sut.checkByEmail({ email: 'any_email@mail.com' })
      expect(exist).toBe(false)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await sut.add(mockAddAccountParams())
      const account = await sut.loadByEmail({ email: 'any_email@mail.com' })
      expect(account).toBeTruthy()
      expect(account.accountId).toBeTruthy()
      expect(account.user).toBeTruthy()
      expect(account.user.id).toBeTruthy()
      expect(account.user.name).toBe('any_name')
      expect(account.user.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail returns null', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail({ email: 'any_email@mail.com' })
      expect(account).toBeFalsy()
    })
  })
})
