import { type User } from '@/domain/entities'

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
    export type Result = {
      accountId: string
      userId: string
    } & User.BaseDataModel.Body
  }
}
