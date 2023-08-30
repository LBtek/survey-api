import { type UserID, type User } from '@/domain/entities'
import { type AccountID, type AuthenticatedAccount } from '@/application/entities'
import { type AuthenticationModel } from '@/application/models'

export namespace AuthenticationRepository {
  export namespace AuthenticateUser {
    export type Params =
    { accountId: AccountID } &
    { user: User.Model } &
    { role: AuthenticatedAccount.BaseAccessKey.Key['role'] }
    & Omit<AuthenticationModel.LoadUserByToken.Params, 'roles'>

    export type Result = void
  }

  export namespace LoadUser {
    export type Params =
    { userId: UserID } &
    { role: AuthenticatedAccount.BaseAccessKey.Key['role'] }
    & Omit<AuthenticationModel.LoadUserByToken.Params, 'roles'>

    export type Result = AuthenticatedAccount.UserAccount
  }
}

export interface ILoadAuthenticatedUserRepository {
  loadUser: (data: AuthenticationRepository.LoadUser.Params) => Promise<AuthenticationRepository.LoadUser.Result>
}

export interface IAuthenticateUserRepository {
  authenticate: (data: AuthenticationRepository.AuthenticateUser.Params) => Promise<AuthenticationRepository.AuthenticateUser.Result>
}
