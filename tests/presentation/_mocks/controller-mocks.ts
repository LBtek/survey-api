import { type HttpRequest, type IController, type HttpResponse } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers/http/http-helper'

export class ControllerSpy implements IController {
  httpRequest: HttpRequest
  bodyResponse: any = { res: 'any_response' }
  httpHelper = ok

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return this.httpHelper(this.bodyResponse)
  }
}
