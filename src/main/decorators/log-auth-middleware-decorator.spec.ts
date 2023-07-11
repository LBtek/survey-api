import { type HttpRequest } from '@/presentation/protocols'
import { LogAuthMiddlewareDecorator } from './log-auth-middleware-decorator'
import { ok } from '@/presentation/helpers/http/http-helper'
import { AuthMiddlewareSpy } from '@/presentation/_mocks/middleware-mocks'
import { LogErrorRepositorySpy } from '@/data/mocks'
import { mockServerError } from '@/presentation/_mocks'
import { mockJWTError, mockNotBeforeError, mockTokenExpiredError } from '@/infra/_mocks/jwt-error-mocks'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  },
  body: { any_value: 'any_value' }
})

type SutTypes = {
  sut: LogAuthMiddlewareDecorator
  middlewareSpy: AuthMiddlewareSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const middlewareSpy = new AuthMiddlewareSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogAuthMiddlewareDecorator(middlewareSpy, logErrorRepositorySpy)

  return {
    sut,
    middlewareSpy,
    logErrorRepositorySpy
  }
}

describe('Log Auth Middleware Decorator', () => {
  test('Should call middleware handle with correct value', async () => {
    const { sut, middlewareSpy } = makeSut()
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(middlewareSpy.httpRequest).toEqual(request)
  })

  test('Should return the same result of the middleware', async () => {
    const { sut, middlewareSpy } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(middlewareSpy.bodyResponse))
  })

  test('Should call LogErrorRepository with correct error', async () => {
    const { sut, middlewareSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    const jwtError = mockJWTError()
    const tokenExpiredError = mockTokenExpiredError()
    const notBeforeError = mockNotBeforeError()

    jest.spyOn(middlewareSpy, 'handle').mockReturnValueOnce(Promise.resolve(serverError))
    await sut.handle(makeFakeRequest())
    expect(logErrorRepositorySpy.stack).toBe('any_stack')
    expect(logErrorRepositorySpy.typeError).toBe('server')

    jest.spyOn(middlewareSpy, 'handle').mockReturnValueOnce(Promise.resolve(jwtError))
    await sut.handle(makeFakeRequest())
    expect(logErrorRepositorySpy.stack).toBe('jwt_stack')
    expect(logErrorRepositorySpy.typeError).toBe('auth')

    jest.spyOn(middlewareSpy, 'handle').mockReturnValueOnce(Promise.resolve(tokenExpiredError))
    await sut.handle(makeFakeRequest())
    expect(logErrorRepositorySpy.stack).toBe('token-expired_stack')
    expect(logErrorRepositorySpy.typeError).toBe('auth')

    jest.spyOn(middlewareSpy, 'handle').mockReturnValueOnce(Promise.resolve(notBeforeError))
    await sut.handle(makeFakeRequest())
    expect(logErrorRepositorySpy.stack).toBe('NotBeforeError_stack')
    expect(logErrorRepositorySpy.typeError).toBe('auth')
  })
})
