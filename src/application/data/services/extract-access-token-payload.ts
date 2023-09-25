/* eslint-disable @typescript-eslint/no-floating-promises */
import { type IDeleteAccessTokenRepository } from '../protocols/repositories'
import { type IExtractAccessTokenPayloadService } from '@/presentation/protocols'
import { type TokenDecrypter } from '../protocols/criptography'
import { type AuthenticationModel } from '@/application/models'
import { AccessDeniedError, InvalidTokenPayload } from '@/application/errors'
import { TokenExpiredError } from '@/infra/errors'
import { setOfAllRoles } from '../helpers'

export class ExtractAccessTokenPayload implements IExtractAccessTokenPayloadService {
  constructor (
    private readonly tokenDecrypter: TokenDecrypter,
    private readonly deleteAccessTokenRepository: IDeleteAccessTokenRepository
  ) { }

  async extract (data: AuthenticationModel.ExtractAccessTokenPayload.Params): Promise<AuthenticationModel.ExtractAccessTokenPayload.Result> {
    try {
      const payload = await this.tokenDecrypter.decrypt(data.accessToken)
      if (
        !payload.userId || !payload.accountId || !payload.role || !payload.willExpireIn ||
        typeof payload.userId !== 'string' ||
        typeof payload.accountId !== 'string' ||
        typeof payload.role !== 'string' ||
        typeof payload.willExpireIn !== 'number'
      ) {
        throw new InvalidTokenPayload()
      } else if (
        !setOfAllRoles.has(payload.role)
      ) {
        throw new AccessDeniedError()
      }
      return payload
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.deleteAccessTokenRepository.deleteAccessToken(data)
      }
      throw error
    }
  }
}
