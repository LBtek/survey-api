import { type AddUserAccountModel } from '@/domain/models'

export interface IAddUserAccount {
  add: (data: AddUserAccountModel.Params) => Promise<AddUserAccountModel.Result>
}
