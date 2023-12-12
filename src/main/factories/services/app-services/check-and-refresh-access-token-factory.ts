import { type ICheckAndRefreshAccessTokenService } from '@/presentation/protocols'
import { CheckAndRefreshAccessToken } from '@/application/data/services'
import { authenticatedUserAccountsRepository } from '@/main/factories/repositories'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeCheckAndRefreshTokenService = (): ICheckAndRefreshAccessTokenService => {
  const jwtTokenAdapter = new JwtAdapter(env.api.jwtSecret)
  return new CheckAndRefreshAccessToken(jwtTokenAdapter, authenticatedUserAccountsRepository)
}
