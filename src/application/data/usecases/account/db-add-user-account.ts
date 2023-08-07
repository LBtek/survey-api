import { type Account } from '@/domain/entities'
import { type AddUserAccount } from '@/domain/usecases/user-context'
import { type CheckUserAccountByEmailRepository, type AddUserAccountRepository } from '@/application/data/protocols/repositories/account-repository'
import { type Hasher } from '@/application/data/protocols/criptography'
import { EmailInUserError } from '@/domain/errors'

export class DbAddUserAccount implements AddUserAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addUserAccountRepository: AddUserAccountRepository,
    private readonly checkUserAccountByEmailRepository: CheckUserAccountByEmailRepository
  ) { }

  async add (data: Account.AddUserAccount.Params): Promise<Account.AddUserAccount.Result> {
    const exist = await this.checkUserAccountByEmailRepository.checkByEmail({ email: data.email })
    if (exist) {
      return new EmailInUserError()
    }
    const hashedPassword = await this.hasher.hash(data.password)
    await this.addUserAccountRepository.add({ ...data, password: hashedPassword })

    return 'Ok'
  }
}
