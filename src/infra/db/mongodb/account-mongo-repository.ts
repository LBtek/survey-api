import { MongoHelper } from './helpers/mongo-helper'
import {
  type AccountRepository,
  type ICheckUserAccountByEmailRepository,
  type IAddUserAccountRepository,
  type ILoadUserAccountByEmailRepository
} from '@/application/data/protocols/repositories/account-repository'

export class AccountMongoRepository implements IAddUserAccountRepository, ICheckUserAccountByEmailRepository, ILoadUserAccountByEmailRepository {
  async add (accountData: AccountRepository.AddUserAccount.Params): Promise<AccountRepository.AddUserAccount.Result> {
    const userCollection = await MongoHelper.getCollection('users')
    const accountCollection = await MongoHelper.getCollection('accounts')

    const { password, role, ...userData } = accountData

    const user = await userCollection.insertOne(userData)

    const account = await accountCollection.insertOne({
      userId: user.insertedId,
      role,
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
    const accountFound = user && (data.role
      ? await accountCollection.findOne({ userId: userFound._id, role: data.role })
      : await accountCollection.findOne({ userId: userFound._id })
    )
    const account = accountFound && MongoHelper.mapOneDocumentWithId(accountFound)

    if (account) {
      const { id: accountId, userId, ...accountData } = account

      return {
        accountId,
        ...accountData,
        user
      }
    }
    return null
  }
}
