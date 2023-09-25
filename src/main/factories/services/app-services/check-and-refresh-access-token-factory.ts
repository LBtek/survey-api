import { type ICheckAndRefreshAccessTokenService } from '@/presentation/protocols'
import { CheckAndRefreshAccessToken } from '@/application/data/services'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/in-memory/authenticated-user-accounts-repository'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeCheckAndRefreshTokenService = (): ICheckAndRefreshAccessTokenService => {
  const jwtTokenAdapter = new JwtAdapter(env.jwtSecret)
  const authenticatedUserAccountsRepository = new InMemoryAuthenticatedUserAccountsRepository()
  return new CheckAndRefreshAccessToken(jwtTokenAdapter, authenticatedUserAccountsRepository)
}
