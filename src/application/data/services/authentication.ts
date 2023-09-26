import { type IAuthenticationService, type AuthParams, type AuthResult } from '@/presentation/protocols/services'
import { type IHashComparer, type ITokenGenerator } from '@/application/data/protocols/criptography'
import {
  type IAuthenticateUserRepository,
  type ILoadUserAccountByEmailRepository
} from '@/application/data/protocols/repositories'
import { UnauthorizedError } from '@/application/errors'

export class Authentication implements IAuthenticationService {
  constructor (
    private readonly loadUserAccountByEmailRepository: ILoadUserAccountByEmailRepository,
    private readonly authenticateUserRepository: IAuthenticateUserRepository,
    private readonly hashComparer: IHashComparer,
    private readonly tokenGenerator: ITokenGenerator
  ) { }

  async auth (authentication: AuthParams): Promise<AuthResult | UnauthorizedError> {
    const { ip, email, role } = authentication
    const account = role
      ? await this.loadUserAccountByEmailRepository.loadByEmail({ email, role })
      : await this.loadUserAccountByEmailRepository.loadByEmail({ email })

    if (account) {
      const { accountId, user, ...rest } = account
      const isValid = await this.hashComparer.compare(authentication.password, account.password)

      if (isValid) {
        const role = rest.role || 'basic_user'
        const accessToken = await this.tokenGenerator.generate({ userId: user.id, accountId, role })
        await this.authenticateUserRepository.authenticate({
          accountId,
          ip,
          accessToken,
          role,
          user
        })

        return { username: account.user.name, accessToken }
      }
    }
    return new UnauthorizedError()
  }
}
