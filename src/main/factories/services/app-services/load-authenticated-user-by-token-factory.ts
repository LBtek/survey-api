import { type ILoadAuthenticatedUserByTokenService } from '@/presentation/protocols'
import { LoadAuthenticatedUserByToken } from '@/application/data/services'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/authenticated-user-accounts-repository'

export const makeLoadAuthenticatedUserByTokenService = (): ILoadAuthenticatedUserByTokenService => {
  const authenticatedUserAccountsRepository = new InMemoryAuthenticatedUserAccountsRepository()
  return new LoadAuthenticatedUserByToken(authenticatedUserAccountsRepository)
}
