/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { type EmailInUserError } from '../errors'
import { type User } from './user'

export namespace Account {
  export namespace BaseDataModel {
    export type Body = {
      userId: string
      password: string
      accessToken?: string
      role?: Roles
    }

    export type Roles = 'admin' | 'publisher'
  }

  export namespace AddUserAccount {
    export type Params = User.BaseDataModel.Body & { password: string }
    export type Result = 'Ok' | EmailInUserError
  }

  export namespace Authentication {
    export namespace Login {
      export type Params = {
        email: string
        password: string
      }
      export type Result = {
        accessToken: string
        username: string
      }
    }

    export namespace LoadUserByToken {
      export type Params = {
        accessToken: string
        role?: string
      }
      export type Result = { accountId: string, userId: string } & User.BaseDataModel.Body
    }
  }
}
