import { type AccountModel } from '../../../domain/models/account'
import { type AddAccountModel, type AddAccount } from '../../../domain/usecases/add-account'
import { type Hasher } from '../../protocols/hasher'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher

  constructor (hasher: Hasher) {
    this.hasher = hasher
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.hasher.hash(account.password)

    return await new Promise(resolve => {
      resolve(null)
    })
  }
}
