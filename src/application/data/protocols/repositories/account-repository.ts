import { type UserID, type User } from '@/domain/entities'
import { type AccountID, type Account } from '@/application/entities'
import { type AddUserAccountModel } from '@/domain/models'
import { type Email } from '@/domain/value-objects'

export namespace AccountRepository {
  export namespace AddUserAccount {
    export type Params = AddUserAccountModel.Params
    export type Result = { accountId: AccountID, userId: UserID }
  }

  export namespace CheckUserAccountByEmail {
    export type Params = { email: Email }
    export type Result = boolean
  }

  export namespace LoadUserAccountByEmail {
    export type Params = { email: Email }

    export type Result =
    { accountId: AccountID } & Omit<Account.BaseDataModel.Body, 'userId'> &
    { user: User.Model }
  }
}

export interface IAddUserAccountRepository {
  add: (data: AccountRepository.AddUserAccount.Params) => Promise<AccountRepository.AddUserAccount.Result>
}

export interface ICheckUserAccountByEmailRepository {
  checkByEmail: (data: AccountRepository.CheckUserAccountByEmail.Params) => Promise<AccountRepository.CheckUserAccountByEmail.Result>
}

export interface ILoadUserAccountByEmailRepository {
  loadByEmail: (data: AccountRepository.LoadUserAccountByEmail.Params) => Promise<AccountRepository.LoadUserAccountByEmail.Result>
}
