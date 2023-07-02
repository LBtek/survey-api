import { type HttpRequest, type HttpResponse, type Middleware } from '../protocols'
import { ok } from '../helpers/http/http-helper'

export const mockAuthMiddleware = (): Middleware => {
  class AuthMiddlewareStub implements Middleware {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok('ok'))
    }
  }
  return new AuthMiddlewareStub()
}
