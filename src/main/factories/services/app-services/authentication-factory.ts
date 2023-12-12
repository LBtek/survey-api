import { type IAuthenticationService } from '@/presentation/protocols'
import { Authentication } from '@/application/data/services'
import { authenticatedUserAccountsRepository } from '@/main/factories/repositories'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeAuthenticationService = (): IAuthenticationService => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.api.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new Authentication(accountMongoRepository, authenticatedUserAccountsRepository, bcryptAdapter, jwtAdapter)
}
