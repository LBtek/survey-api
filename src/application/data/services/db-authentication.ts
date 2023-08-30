import { type IAuthenticationService, type AuthParams, type AuthResult } from '@/presentation/protocols/services'
import { type HashComparer, type TokenGenerator } from '@/application/data/protocols/criptography'
import {
  type IAuthenticateUserRepository,
  type ILoadUserAccountByEmailRepository
} from '@/application/data/protocols/repositories'
import { UnauthorizedError } from '@/application/errors'

export class Authentication implements IAuthenticationService {
  constructor (
    private readonly loadUserAccountByEmailRepository: ILoadUserAccountByEmailRepository,
    private readonly authenticateUserRepository: IAuthenticateUserRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) { }

  async auth (authentication: AuthParams): Promise<AuthResult | UnauthorizedError> {
    const { ip, email } = authentication
    const account = await this.loadUserAccountByEmailRepository.loadByEmail({ email })

    if (account) {
      const { accountId, user, ...rest } = account
      const isValid = await this.hashComparer.compare(authentication.password, account.password)

      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(user.id)
        await this.authenticateUserRepository.authenticate({
          accountId,
          ip,
          accessToken,
          role: rest.role || 'basic_user',
          user
        })

        return { username: account.user.name, accessToken }
      }
    }
    return new UnauthorizedError()
  }
}
