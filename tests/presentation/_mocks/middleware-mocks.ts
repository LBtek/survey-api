import { type HttpRequest, type HttpResponse, type IMiddleware } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers/http/http-helper'

export class AuthMiddlewareSpy implements IMiddleware {
  httpRequest: HttpRequest
  bodyResponse = { res: 'any_response' }
  httpHelper = ok

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return this.httpHelper(this.bodyResponse)
  }
}
