import { type AuthenticationModel } from '@/application/models'
import { type ILoadAuthenticatedUserByTokenService } from '@/presentation/protocols/services'
import { type ILoadOwnAuthenticatedUserRepository } from '../protocols/repositories'

export class LoadAuthenticatedUserByToken implements ILoadAuthenticatedUserByTokenService {
  constructor (
    private readonly loadAuthenticatedUserRepository: ILoadOwnAuthenticatedUserRepository
  ) { }

  async loadByToken (data: AuthenticationModel.LoadUserByToken.Params): Promise<AuthenticationModel.LoadUserByToken.Result> {
    const { roles, tokenPayload, ...rest } = data
    if (!roles || !roles.size) {
      throw new Error('Empty Roles')
    }
    if (
      tokenPayload.userId &&
      tokenPayload.accountId &&
      tokenPayload.role &&
      roles.has(tokenPayload.role)
    ) {
      const { userId, accountId, role } = tokenPayload
      const user = await this.loadAuthenticatedUserRepository.loadOwnUser({
        accountId,
        userId,
        role,
        ...rest
      })
      return user
    }
    return null
  }
}
