import { type AddUserAccount } from '@/domain/usecases/user-context'
import { DbAddUserAccount } from '@/application/data/usecases/account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { BcryptAdapter } from '@/infra/criptography'

export const makeDbAddAccount = (): AddUserAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddUserAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
