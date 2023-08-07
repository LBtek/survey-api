/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type Account, type User } from '@/domain/entities'

export namespace AccountRepository {
  export namespace AddUserAccount {
    export type Params = Account.AddUserAccount.Params
    export type Result = { accountId: string, userId: string }
  }

  export namespace CheckUserAccountByEmail {
    export type Params = { email: string }
    export type Result = boolean
  }

  export namespace LoadUserAccountByEmail {
    export type Params = { email: string }

    export type Result =
    { accountId: string } & Omit<Account.BaseDataModel.Body, 'userId'> &
    { user: { userId: string } & User.BaseDataModel.Body }
  }

  export namespace LoadUserAccountByToken {
    export type Params = { accessToken: string, role?: string }
    export type Result = { accountId: string, userId: string } & User.BaseDataModel.Body
  }

  export namespace UpdateAccessToken {
    export type Params = { accountId: string, accessToken: string }
    export type Result = void
  }
}

export interface AddUserAccountRepository {
  add: (data: AccountRepository.AddUserAccount.Params) => Promise<AccountRepository.AddUserAccount.Result>
}

export interface CheckUserAccountByEmailRepository {
  checkByEmail: (data: AccountRepository.CheckUserAccountByEmail.Params) => Promise<AccountRepository.CheckUserAccountByEmail.Result>
}

export interface LoadUserAccountByEmailRepository {
  loadByEmail: (data: AccountRepository.LoadUserAccountByEmail.Params) => Promise<AccountRepository.LoadUserAccountByEmail.Result>
}

export interface LoadUserAccountByTokenRepository {
  loadByToken: (data: AccountRepository.LoadUserAccountByToken.Params) => Promise<AccountRepository.LoadUserAccountByToken.Result>
}

export interface UpdateAccessTokenRepository {
  updateAccessToken: (data: AccountRepository.UpdateAccessToken.Params) => Promise<AccountRepository.UpdateAccessToken.Result>
}
