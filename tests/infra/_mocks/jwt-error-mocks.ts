import { type HttpResponse } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers/http/http-helper'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

export const mockJWTError = (): HttpResponse => {
  const fakeError = new JsonWebTokenError('jwt malformed')
  fakeError.stack = 'jwt_stack'
  return badRequest(fakeError)
}

export const mockTokenExpiredError = (): HttpResponse => {
  const fakeError = new TokenExpiredError('token expired', new Date())
  fakeError.stack = 'token-expired_stack'
  return badRequest(fakeError)
}

export const mockNotBeforeError = (): HttpResponse => {
  const fakeError = new NotBeforeError('error', new Date())
  fakeError.stack = 'NotBeforeError_stack'
  return badRequest(fakeError)
}
