import { type Password } from '@/application/entities'
import { type User } from '../entities'
import { type EmailInUserError } from '../errors'

export namespace AddUserAccountModel {
  export type Params = User.BaseDataModel.Body & { password: Password }
  export type Result = 'Ok' | EmailInUserError
}
