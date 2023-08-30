import { type AddUserAccountModel } from '@/domain/models'
import { type IAddUserAccount as IAddUserAccountUsecase } from '@/domain/usecases/user-context'

export class AddUserAccountSpy implements IAddUserAccountUsecase {
  addAccountData: AddUserAccountModel.Params
  response: AddUserAccountModel.Result = 'Ok'

  async add (data: AddUserAccountModel.Params): Promise<AddUserAccountModel.Result> {
    this.addAccountData = data
    return this.response
  }
}
