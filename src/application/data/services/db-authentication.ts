import { type AuthenticationService, type AuthParams, type AuthResult } from '@/presentation/protocols/services'
import { type HashComparer, type TokenGenerator } from '@/application/data/protocols/criptography'
import {
  type UpdateAccessTokenRepository,
  type LoadUserAccountByEmailRepository
} from '@/application/data/protocols/repositories'
import { UnauthorizedError } from '@/application/errors'

export class DbAuthentication implements AuthenticationService {
  constructor (
    private readonly loadUserAccountByEmailRepository: LoadUserAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) { }

  async auth (authentication: AuthParams): Promise<AuthResult | UnauthorizedError> {
    const account = await this.loadUserAccountByEmailRepository.loadByEmail({ email: authentication.email })
    if (account) {
      const { accountId } = account
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(accountId)
        await this.updateAccessTokenRepository.updateAccessToken({ accountId, accessToken })

        return { username: account.user.name, accessToken }
      }
    }
    return new UnauthorizedError()
  }
}
