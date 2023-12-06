import { type ILoadAuthenticatedUserByTokenService } from '@/presentation/protocols'
import { LoadAuthenticatedUserByToken } from '@/application/data/services'
import { RedisAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/redis'

export const makeLoadAuthenticatedUserByTokenService = (): ILoadAuthenticatedUserByTokenService => {
  const authenticatedUserAccountsRepository = new RedisAuthenticatedUserAccountsRepository()
  return new LoadAuthenticatedUserByToken(authenticatedUserAccountsRepository)
}
