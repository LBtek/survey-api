import { type UserID } from '@/domain/entities'
import { type IP, type AccountID, type AuthenticatedAccount, type AccessToken } from '@/application/entities'

export namespace AuthenticationRepository {
  export namespace AuthenticateUser {
    export type Params =
    { ip: IP, accessToken: AccessToken }
    & AuthenticatedAccount.UserAccount

    export type Result = void
  }

  export namespace LoadOwnUser {
    export type Params = {
      ip: IP
      accessToken: AccessToken
      userId: UserID
      accountId: AccountID
      role: AuthenticatedAccount.UserAccount['role']
    }

    export type Result = AuthenticatedAccount.UserAccount
  }

  export namespace DeleteAccessToken {
    export type Params = {
      ip: IP
      accessToken: AccessToken
      userId?: UserID
      accountId?: AccountID
      role?: AuthenticatedAccount.UserAccount['role']
    }

    export type Result = boolean
  }

  export namespace RefreshAccessToken {
    export type Params =
    { oldAccessToken: string, newAccessToken: string }
    & Omit<AuthenticationRepository.LoadOwnUser.Params, 'accessToken'>

    export type Result = boolean
  }
}

export interface ILoadOwnAuthenticatedUserRepository {
  loadOwnUser: (data: AuthenticationRepository.LoadOwnUser.Params) => Promise<AuthenticationRepository.LoadOwnUser.Result>
}

export interface IAuthenticateUserRepository {
  authenticate: (data: AuthenticationRepository.AuthenticateUser.Params) => Promise<AuthenticationRepository.AuthenticateUser.Result>
}

export interface IRefreshAccessTokenRepository {
  refreshToken: (data: AuthenticationRepository.RefreshAccessToken.Params) => Promise<AuthenticationRepository.RefreshAccessToken.Result>
}

export interface IDeleteAccessTokenRepository {
  deleteAccessToken: (data: AuthenticationRepository.DeleteAccessToken.Params) => Promise<AuthenticationRepository.DeleteAccessToken.Result>
}
