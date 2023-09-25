import { type Account } from '@/application/entities'
import {
  type Middleware,
  type HttpResponse,
  type IExtractAccessTokenPayloadService,
  type ILoadAuthenticatedUserByTokenService,
  type ICheckAndRefreshAccessTokenService
} from '@/presentation/protocols'
import { AccessDeniedError, InvalidTokenPayload, UnauthorizedError } from '@/application/errors'
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from '@/infra/errors'
import { badRequest, forbidden, ok, serverError, unauthorized } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly extractAccessTokenPayload: IExtractAccessTokenPayloadService,
    private readonly loadAuthenticatedUserByToken: ILoadAuthenticatedUserByTokenService,
    private readonly checkAndRefreshAccessToken: ICheckAndRefreshAccessTokenService,
    private readonly roles?: Set<Account.BaseDataModel.Roles>
  ) { }

  async handle (request: { ip: string, accessToken: string }): Promise<HttpResponse> {
    const { ip, accessToken } = request || { ip: null, accessToken: null }
    try {
      if (ip && accessToken) {
        const tokenPayload = await this.extractAccessTokenPayload.extract({ ip, accessToken })
        const account = await this.loadAuthenticatedUserByToken.loadByToken({
          ip,
          accessToken,
          roles: this.roles && this.roles.size ? this.roles : new Set<Account.BaseDataModel.Roles>().add('basic_user'),
          tokenPayload
        })
        if (account) {
          const newAccessToken = await this.checkAndRefreshAccessToken.checkAndRefresh({
            ip,
            accessToken,
            tokenPayload
          })
          if (!newAccessToken) {
            return ok({ userId: account.user.id, accountId: account.accountId })
          } else if (typeof newAccessToken === 'string') {
            return ok({ userId: account.user.id, accountId: account.accountId, newAccessToken })
          }
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      let response: HttpResponse
      if (
        error instanceof NotBeforeError ||
        error instanceof AccessDeniedError
      ) {
        response = forbidden(new AccessDeniedError())
      } else if (
        error instanceof TokenExpiredError ||
        error instanceof UnauthorizedError
      ) {
        response = unauthorized()
      } else if (
        error instanceof JsonWebTokenError ||
        error instanceof InvalidTokenPayload
      ) {
        response = badRequest(error)
      } else {
        response = serverError(error)
      }
      return response
    }
  }
}
