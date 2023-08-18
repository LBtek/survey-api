import { type User } from '../entities'
import { type EmailInUserError } from '../errors'

export namespace AddUserAccount {
  export type Params = User.BaseDataModel.Body & { password: string }
  export type Result = 'Ok' | EmailInUserError
}
