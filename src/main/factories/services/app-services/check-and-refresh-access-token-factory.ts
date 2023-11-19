import { type ICheckAndRefreshAccessTokenService } from '@/presentation/protocols'
import { CheckAndRefreshAccessToken } from '@/application/data/services'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/authenticated-user-accounts-repository'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeCheckAndRefreshTokenService = (): ICheckAndRefreshAccessTokenService => {
  const jwtTokenAdapter = new JwtAdapter(env.api.jwtSecret)
  const authenticatedUserAccountsRepository = new InMemoryAuthenticatedUserAccountsRepository()
  return new CheckAndRefreshAccessToken(jwtTokenAdapter, authenticatedUserAccountsRepository)
}
