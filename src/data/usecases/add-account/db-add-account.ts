import { type AccountModel, type AddAccountModel, type AddAccount, type Hasher } from './db-add-account-protocols'

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
