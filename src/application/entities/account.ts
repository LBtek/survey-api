import { type UserID, type User } from '@/domain/entities'

export type Password = string
export type AccountID = string
export type AccessToken = string
export type IP = string

export namespace Account {
  export namespace BaseDataModel {
    export type Body = {
      userId: UserID
      password: Password
      role: Roles
    }

    export type Roles = 'admin' | 'publisher' | 'basic_user'
  }
}

export namespace AuthenticatedAccount {
  export namespace BaseDataModel {
    export type Body = {
      ips: Map<IP, Set<AccessToken>>
      role: Account.BaseDataModel.Roles
    }
  }
  export type UserAccount = {
    accountId: AccountID
    user: User.Model
    role: Account.BaseDataModel.Roles
  }
}
