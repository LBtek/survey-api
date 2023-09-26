import { type AddUserAccountModel } from '@/domain/models'
import { type IAddUserAccount as IAddUserAccountUsecase } from '@/domain/usecases'
import { type ICheckUserAccountByEmailRepository, type IAddUserAccountRepository } from '@/application/data/protocols/repositories/account-repository'
import { type IHasher } from '@/application/data/protocols/criptography'
import { EmailInUserError } from '@/domain/errors'

export class AddUserAccount implements IAddUserAccountUsecase {
  constructor (
    private readonly hasher: IHasher,
    private readonly addUserAccountRepository: IAddUserAccountRepository,
    private readonly checkUserAccountByEmailRepository: ICheckUserAccountByEmailRepository
  ) { }

  async add (data: AddUserAccountModel.Params): Promise<AddUserAccountModel.Result> {
    const exist = await this.checkUserAccountByEmailRepository.checkByEmail({ email: data.email })
    if (exist) {
      return new EmailInUserError()
    }
    const hashedPassword = await this.hasher.hash(data.password)
    await this.addUserAccountRepository.add({ ...data, password: hashedPassword })

    return 'Ok'
  }
}
