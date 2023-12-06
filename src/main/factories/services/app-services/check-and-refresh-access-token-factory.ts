import { type ICheckAndRefreshAccessTokenService } from '@/presentation/protocols'
import { CheckAndRefreshAccessToken } from '@/application/data/services'
import { RedisAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/redis'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeCheckAndRefreshTokenService = (): ICheckAndRefreshAccessTokenService => {
  const jwtTokenAdapter = new JwtAdapter(env.api.jwtSecret)
  const authenticatedUserAccountsRepository = new RedisAuthenticatedUserAccountsRepository()
  return new CheckAndRefreshAccessToken(jwtTokenAdapter, authenticatedUserAccountsRepository)
}
