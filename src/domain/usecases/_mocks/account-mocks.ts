import { type AddAccount, type AddAccountParams } from '@/domain/usecases/account/add-account'
import { type AuthParams, type Authentication } from '@/domain/usecases/account/authentication'
import { type LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { type AccountModel } from '@/domain/models/account'
import { mockAccount } from '@/domain/models/mocks'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthParams): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel | null> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
      return mockAccount()
    }
  }
  return new LoadAccountByTokenStub()
}
