import { type User } from '@/domain/entities'
import { type Password, type AuthenticatedAccount, type AccessToken, type IP, type AccountID } from '../entities'
import { type Email, type UserName } from '@/domain/value-objects'

export namespace AuthenticationModel {
  export namespace Login {
    export type Params = {
      ip: IP
      email: Email
      password: Password
    }
    export type Result = {
      accessToken: AccessToken
      username: UserName
    }
  }

  export namespace LoadUserByToken {
    export type Params = {
      ip: IP
      accessToken: AccessToken
      roles: Set<AuthenticatedAccount.BaseAccessKey.Key['role'] | null>
    }
    export type Result = {
      accountId: AccountID
      user: User.Model
    }
  }
}
