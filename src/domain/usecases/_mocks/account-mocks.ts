import { type AddAccount, type AddAccountParams } from '@/domain/usecases/account/add-account'
import { type AuthParams, type Authentication } from '@/domain/usecases/account/authentication'
import { type AuthenticationModel } from '@/domain/models/authentication'
import { type LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { type AccountModel } from '@/domain/models/account'
import { mockAccount } from '@/domain/models/mocks'

export class AuthenticationSpy implements Authentication {
  authenticationData: AuthParams
  authenticationModel: AuthenticationModel = {
    name: 'any_name',
    accessToken: 'any_token'
  }

  async auth (authentication: AuthParams): Promise<AuthenticationModel> {
    this.authenticationData = authentication
    return this.authenticationModel
  }
}

export class AddAccountSpy implements AddAccount {
  addAccountData: AddAccountParams
  account = mockAccount()

  async add (addAccountData: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountData = addAccountData
    return this.account
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string
  account = mockAccount()

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return this.account
  }
}
