import { type AuthenticationModel } from '@/application/models'
import { type ICheckAndRefreshAccessTokenService } from '@/presentation/protocols'
import { type IRefreshAccessTokenRepository } from '../protocols/repositories'
import { type TokenGenerator } from '../protocols/criptography'
import { UnauthorizedError } from '@/application/errors'

export class CheckAndRefreshAccessToken implements ICheckAndRefreshAccessTokenService {
  constructor (
    private readonly tokenGenerator: TokenGenerator,
    private readonly refreshAccessTokenRepository: IRefreshAccessTokenRepository
  ) { }

  async checkAndRefresh (data: AuthenticationModel.CheckAndRefreshToken.Params): Promise<AuthenticationModel.CheckAndRefreshToken.Result> {
    const { ip, accessToken, tokenPayload } = data
    const { userId, accountId, role } = tokenPayload

    if (
      typeof tokenPayload.willExpireIn === 'number' &&
      Math.round(Date.now() / 1000) >= tokenPayload.willExpireIn
    ) {
      const { willExpireIn, ...rest } = tokenPayload
      const newAccessToken = await this.tokenGenerator.generate(rest)
      const wasUpdated = await this.refreshAccessTokenRepository.refreshToken({
        ip,
        oldAccessToken: accessToken,
        newAccessToken,
        userId,
        accountId,
        role
      })
      if (wasUpdated) {
        return newAccessToken
      } else {
        throw new UnauthorizedError()
      }
    }
    return null
  }
}
