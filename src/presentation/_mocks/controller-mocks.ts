import { type HttpRequest, type Controller, type HttpResponse } from '../protocols'
import { ok } from '../helpers/http/http-helper'
import { mockAccount } from '@/domain/models/mocks'

export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok(mockAccount()))
    }
  }
  return new ControllerStub()
}
