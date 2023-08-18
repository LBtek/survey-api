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

  const accessToken = 'any_token'

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.userId).toBeTruthy()
      expect(account.accountId).toBeTruthy()
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
      expect(account.user.userId).toBeTruthy()
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

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const { accountId } = await sut.add(mockAddAccountParams())
      const accountBeforeUpdate = await accountCollection.findOne({ _id: new ObjectId(accountId) })
      expect(accountBeforeUpdate?.accessToken).toBeFalsy()
      await sut.updateAccessToken({ accountId, accessToken: 'any_token' })
      const accountAfterUpdate = await accountCollection.findOne({ _id: new ObjectId(accountId) })
      expect(accountAfterUpdate).toBeTruthy()
      expect(accountAfterUpdate?.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an user account on loadByToken without role', async () => {
      const sut = makeSut()
      const { accountId } = await sut.add(mockAddAccountParams())
      await sut.updateAccessToken({ accountId, accessToken })
      const account = await sut.loadByToken({ accessToken })
      expect(account).toBeTruthy()
      expect(account.accountId).toBeTruthy()
      expect(account.userId).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
    })

    test('Should return an account on loadByToken with publisher role', async () => {
      const sut = makeSut()
      const { accountId } = await sut.add(mockAddAccountParams())
      await sut.updateAccessToken({ accountId, accessToken })
      await accountCollection.updateOne(
        { _id: new ObjectId(accountId) },
        { $set: { role: 'publisher' } }
      )
      const account = await sut.loadByToken({ accessToken, role: 'publisher' })
      expect(account).toBeTruthy()
      expect(account.accountId).toBeTruthy()
      expect(account.userId).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      const { accountId } = await sut.add(mockAddAccountParams())
      await sut.updateAccessToken({ accountId, accessToken })
      const account = await sut.loadByToken({ accessToken, role: 'publisher' })
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      const { accountId } = await sut.add(mockAddAccountParams())
      await sut.updateAccessToken({ accountId, accessToken })
      await accountCollection.updateOne(
        { _id: new ObjectId(accountId) },
        { $set: { role: 'admin' } }
      )
      const account = await sut.loadByToken({ accessToken })
      expect(account).toBeTruthy()
      expect(account.accountId).toBeTruthy()
      expect(account.userId).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
    })

    test('Should return null if loadByToken returns null', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken({ accessToken })
      expect(account).toBeFalsy()
    })
  })
})
