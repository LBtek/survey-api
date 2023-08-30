import { type IAddUserAccount } from '@/domain/usecases/user-context'
import { AddUserAccount } from '@/application/data/usecases/account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { BcryptAdapter } from '@/infra/criptography'

export const makeAddAccountUsecase = (): IAddUserAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new AddUserAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
