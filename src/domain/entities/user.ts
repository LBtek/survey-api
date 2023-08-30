import { type UserName, type Email } from '../value-objects'

export type UserID = string

export namespace User {
  export type Model = { id: UserID } & BaseDataModel.Body

  export namespace BaseDataModel {
    export type Body = {
      name: UserName
      email: Email
    }
  }
}
