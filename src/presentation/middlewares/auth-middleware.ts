import { type Account } from '@/application/entities'
import { type Authentication } from '@/application/models'
import { type Middleware, type HttpResponse, type LoadUserAccountByTokenService } from '@/presentation/protocols'
import { AccessDeniedError } from '@/application/errors'
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from '@/infra/errors'
import { badRequest, forbidden, ok, serverError } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserAccountByTokenService: LoadUserAccountByTokenService,
    private readonly role?: Account.BaseDataModel.Roles
  ) { }

  async handle (request: Authentication.LoadUserByToken.Params): Promise<HttpResponse> {
    try {
      const accessToken = request?.accessToken
      if (accessToken) {
        const account = await this.loadUserAccountByTokenService.loadByToken({ accessToken, role: this.role })
        if (account) {
          return ok({ accountId: account.accountId })
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
