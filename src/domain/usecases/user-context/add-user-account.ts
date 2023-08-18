import { type AddUserAccount as AddUserAccountModel } from '@/domain/models'

export interface AddUserAccount {
  add: (data: AddUserAccountModel.Params) => Promise<AddUserAccountModel.Result>
}
