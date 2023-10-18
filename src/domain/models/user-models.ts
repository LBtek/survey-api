import { type Account, type Password } from '@/application/entities'
import { type User } from '../entities'
import { type EmailInUseError } from '../errors'

export namespace AddUserAccountModel {
  export type Params = User.BaseDataModel.Body & { password: Password, role: Account.BaseDataModel.Roles }
  export type Result = 'Ok' | EmailInUseError
}
