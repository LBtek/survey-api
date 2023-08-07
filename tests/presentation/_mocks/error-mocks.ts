import { type HttpResponse } from '@/presentation/protocols'
import { serverError } from '@/presentation/helpers/http/http-helper'

export const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
