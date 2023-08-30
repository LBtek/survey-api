import { type AuthenticationModel } from '@/application/models'
import { type TokenDecrypter } from '@/application/data/protocols/criptography'
import { type ILoadAuthenticatedUserByTokenService } from '@/presentation/protocols/services'
import { type ILoadAuthenticatedUserRepository } from '../protocols/repositories'

export class LoadAuthenticatedUserByToken implements ILoadAuthenticatedUserByTokenService {
  constructor (
    private readonly tokenDecrypter: TokenDecrypter,
    private readonly loadAuthenticatedUserRepository: ILoadAuthenticatedUserRepository
  ) { }

  async loadByToken (data: AuthenticationModel.LoadUserByToken.Params): Promise<AuthenticationModel.LoadUserByToken.Result> {
    const { roles, ...rest } = data
    if (!roles || !roles.size) {
      throw new Error('Empty Roles')
    }
    const payload = await this.tokenDecrypter.decrypt(data.accessToken)
    if (payload) {
      const promises = []
      roles.forEach((role) => {
        promises.push(this.loadAuthenticatedUserRepository.loadUser({
          userId: payload,
          role,
          ...rest
        }))
      })
      const user = await Promise.all(promises)
      if (user[0]) {
        return user[0]
      }
    }
    return null
  }
}
