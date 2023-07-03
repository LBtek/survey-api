import { type HttpRequest, type HttpResponse, type Middleware } from '../protocols'
import { ok } from '../helpers/http/http-helper'

export class AuthMiddlewareSpy implements Middleware {
  httpRequest: HttpRequest
  bodyResponse = { res: 'any_response' }
  httpHelper = ok

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return this.httpHelper(this.bodyResponse)
  }
}
