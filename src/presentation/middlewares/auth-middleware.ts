import { type Middleware, type HttpRequest, type HttpResponse, type LoadAccountByToken } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors'
import { badRequest, forbidden, ok, serverError } from '../helpers/http/http-helper'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.loadByToken(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
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
