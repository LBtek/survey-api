import { type AddUserAccount } from '@/domain/models'
import { type AddUserAccount as AddUserAccountUsecase } from '@/domain/usecases/user-context'

export class AddUserAccountSpy implements AddUserAccountUsecase {
  addAccountData: AddUserAccount.Params
  response: AddUserAccount.Result = 'Ok'

  async add (data: AddUserAccount.Params): Promise<AddUserAccount.Result> {
    this.addAccountData = data
    return this.response
  }
}
