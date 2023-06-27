import { type HttpResponse } from '../protocols'
import { serverError } from '../helpers/http/http-helper'

export const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
