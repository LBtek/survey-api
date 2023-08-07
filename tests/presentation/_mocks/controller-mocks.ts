import { type HttpRequest, type Controller, type HttpResponse } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers/http/http-helper'

export class ControllerSpy implements Controller {
  httpRequest: HttpRequest
  bodyResponse: any = { res: 'any_response' }
  httpHelper = ok

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return this.httpHelper(this.bodyResponse)
  }
}
