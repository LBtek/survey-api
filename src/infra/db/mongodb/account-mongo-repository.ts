import { ObjectId } from 'mongodb'
import { MongoHelper } from './helpers/mongo-helper'
import {
  type AccountRepository,
  type CheckUserAccountByEmailRepository,
  type AddUserAccountRepository,
  type LoadUserAccountByEmailRepository,
  type LoadUserAccountByTokenRepository,
  type UpdateAccessTokenRepository
} from '@/application/data/protocols/repositories/account-repository'

export class AccountMongoRepository implements AddUserAccountRepository, CheckUserAccountByEmailRepository, LoadUserAccountByEmailRepository, UpdateAccessTokenRepository, LoadUserAccountByTokenRepository {
  async add (accountData: AccountRepository.AddUserAccount.Params): Promise<AccountRepository.AddUserAccount.Result> {
    const userCollection = await MongoHelper.getCollection('users')
    const accountCollection = await MongoHelper.getCollection('accounts')

    const { password, ...userData } = accountData

    const user = await userCollection.insertOne(userData)

    const account = await accountCollection.insertOne({
      userId: user.insertedId,
      password
    })

    return {
      accountId: account.insertedId.toString(),
      userId: user.insertedId.toString()
    }
  }

  async checkByEmail (data: AccountRepository.CheckUserAccountByEmail.Params):
  Promise<AccountRepository.CheckUserAccountByEmail.Result> {
    const userCollection = await MongoHelper.getCollection('users')
    const userFound = await userCollection.findOne({ email: data.email })

    return !!userFound
  }

  async loadByEmail (
    data: AccountRepository.LoadUserAccountByEmail.Params
  ): Promise<AccountRepository.LoadUserAccountByEmail.Result> {
    const userCollection = await MongoHelper.getCollection('users')
    const accountCollection = await MongoHelper.getCollection('accounts')

    const userFound = await userCollection.findOne({ email: data.email })
    const user = userFound && MongoHelper.mapOneDocumentWithId(userFound)
    const accountFound = user && await accountCollection.findOne({ userId: userFound._id })
    const account = accountFound && MongoHelper.mapOneDocumentWithId(accountFound)

    if (account) {
      const { id: accountId, userId, ...accountData } = account
      const { id, ...userData } = user

      return {
        accountId,
        ...accountData,
        user: {
          userId,
          ...userData
        }
      }
    }
    return null
  }

  async updateAccessToken (data: AccountRepository.UpdateAccessToken.Params): Promise<AccountRepository.UpdateAccessToken.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(data.accountId)
    }, {
      $set: {
        accessToken: data.accessToken
      }
    })
  }

  async loadByToken (data: AccountRepository.LoadUserAccountByToken.Params): Promise<AccountRepository.LoadUserAccountByToken.Result> {
    const userCollection = await MongoHelper.getCollection('users')
    const accountCollection = await MongoHelper.getCollection('accounts')

    const accountFound = await accountCollection.findOne({
      accessToken: data.accessToken,
      $or: [{
        role: data.role
      }, {
        role: 'admin'
      }]
    })
    const account = accountFound && MongoHelper.mapOneDocumentWithId(accountFound)
    const userFound = account && await userCollection.findOne({ _id: account.userId })
    const user = userFound && MongoHelper.mapOneDocumentWithId(userFound)

    if (user) {
      const { id: userId, ...userData } = user

      return {
        accountId: account.id,
        userId,
        ...userData
      }
    }
    return null
  }
}
