import { type Account } from '@/application/entities'
import { type AuthenticationModel } from '@/application/models'
import { type Middleware, type HttpResponse, type ILoadAuthenticatedUserByTokenService } from '@/presentation/protocols'
import { AccessDeniedError } from '@/application/errors'
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from '@/infra/errors'
import { badRequest, forbidden, ok, serverError } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAuthenticatedUserByToken: ILoadAuthenticatedUserByTokenService,
    private readonly roles?: Set<Account.BaseDataModel.Roles>
  ) { }

  async handle (request: Omit<AuthenticationModel.LoadUserByToken.Params, 'roles'>): Promise<HttpResponse> {
    try {
      const { ip, accessToken } = request || { ip: null, accessToken: null }
      if (ip && accessToken) {
        const account = await this.loadAuthenticatedUserByToken.loadByToken({
          ip,
          accessToken,
          roles: this.roles && this.roles.size ? this.roles : new Set<Account.BaseDataModel.Roles>().add('basic_user')
        })
        if (account) {
          return ok({ userId: account.user.id, accountId: account.accountId })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      let response: HttpResponse
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError ||
        error instanceof NotBeforeError
      ) {
        response = badRequest(error)
      } else {
        response = serverError(error)
      }
      return response
    }
  }
}
