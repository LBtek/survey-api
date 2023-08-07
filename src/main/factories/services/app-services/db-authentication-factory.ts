import { type AuthenticationService } from '@/presentation/protocols'
import { DbAuthentication } from '@/application/data/services'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeDbAuthentication = (): AuthenticationService => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
