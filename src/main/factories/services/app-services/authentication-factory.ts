import { type IAuthenticationService } from '@/presentation/protocols'
import { Authentication } from '@/application/data/services'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { RedisAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/redis'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeAuthenticationService = (): IAuthenticationService => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.api.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const authenticatedUserAccounts = new RedisAuthenticatedUserAccountsRepository()
  return new Authentication(accountMongoRepository, authenticatedUserAccounts, bcryptAdapter, jwtAdapter)
}
