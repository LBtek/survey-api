import { type ILoadAuthenticatedUserByTokenService } from '@/presentation/protocols'
import { LoadAuthenticatedUserByToken } from '@/application/data/services'
import { authenticatedUserAccountsRepository } from '@/main/factories/repositories'

export const makeLoadAuthenticatedUserByTokenService = (): ILoadAuthenticatedUserByTokenService => {
  return new LoadAuthenticatedUserByToken(authenticatedUserAccountsRepository)
}
