import { type UserID, type User } from '@/domain/entities'
import { type Password, type AuthenticatedAccount, type AccessToken, type IP, type AccountID, type Account } from '../entities'
import { type Email, type UserName } from '@/domain/value-objects'

export namespace AuthenticationModel {
  export namespace Login {
    export type Params = {
      ip: IP
      email: Email
      password: Password
      role: Account.BaseDataModel.Roles
    }
    export type Result = {
      accessToken: AccessToken
      username: UserName
    }
  }

  export namespace Logout {
    export type Params = {
      ip: IP
      accessToken: AccessToken
    }
    export type Result = void
  }

  export type AccessTokenPayload = {
    userId: UserID
    accountId: AccountID
    role: AuthenticatedAccount.UserAccount['role']
    willExpireIn: number
  }

  export namespace LoadUserByToken {
    export type Params = {
      ip: IP
      accessToken: AccessToken
      roles: Set<AuthenticatedAccount.UserAccount['role']>
      tokenPayload: AccessTokenPayload
    }
    export type Result = {
      accountId: AccountID
      role: AuthenticatedAccount.UserAccount['role']
      user: User.Model
    }
  }

  export namespace CheckAndRefreshToken {
    export type Params = {
      ip: IP
      accessToken: AccessToken
      tokenPayload: AccessTokenPayload
    }

    export type Result = string | null
  }

  export namespace ExtractAccessTokenPayload {
    export type Params = {
      ip: IP
      accessToken: AccessToken
    }

    export type Result = AccessTokenPayload
  }
}
