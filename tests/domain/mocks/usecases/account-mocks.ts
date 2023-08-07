import { type Account } from '@/domain/entities'
import { type AddUserAccount } from '@/domain/usecases/user-context'

export class AddUserAccountSpy implements AddUserAccount {
  addAccountData: Account.AddUserAccount.Params
  response: Account.AddUserAccount.Result = 'Ok'

  async add (data: Account.AddUserAccount.Params): Promise<Account.AddUserAccount.Result> {
    this.addAccountData = data
    return this.response
  }
}
