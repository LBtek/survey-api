import { type IAuthenticationService } from '@/presentation/protocols'
import { Authentication } from '@/application/data/services'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/in-memory/authenticated-user-accounts-repository'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeAuthenticationService = (): IAuthenticationService => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const authenticatedUserAccounts = new InMemoryAuthenticatedUserAccountsRepository()
  return new Authentication(accountMongoRepository, authenticatedUserAccounts, bcryptAdapter, jwtAdapter)
}
