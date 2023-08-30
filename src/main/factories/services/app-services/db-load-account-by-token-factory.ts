import { type ILoadAuthenticatedUserByTokenService } from '@/presentation/protocols'
import { LoadAuthenticatedUserByToken } from '@/application/data/services'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/in-memory/authenticated-user-accounts-repository'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeDbLoadUserByAccountAccessToken = (): ILoadAuthenticatedUserByTokenService => {
  const jwtTokenDecrypterAdapter = new JwtAdapter(env.jwtSecret)
  const authenticatedUserAccountsRepository = new InMemoryAuthenticatedUserAccountsRepository()
  return new LoadAuthenticatedUserByToken(jwtTokenDecrypterAdapter, authenticatedUserAccountsRepository)
}
