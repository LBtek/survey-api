import { ObjectId } from 'mongodb'
import { type AccountModel } from '@/domain/models/account'
import { type AddAccountParams } from '@/domain/usecases/account/add-account'
import { type LoadAccountByTokenRepository } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token-protocols'
import { type AddAccountRepository } from '@/data/protocols/repositories/account/add-account-repository'
import { type LoadAccountByEmailRepository } from '@/data/protocols/repositories/account/load-account-by-email-repository'
import { type UpdateAccessTokenRepository } from '@/data/protocols/repositories/account/update-access-token-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)

    return MongoHelper.mapInsertOneResult(result, accountData)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.mapOneDocumentWithId(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account && MongoHelper.mapOneDocumentWithId(account)
  }
}
