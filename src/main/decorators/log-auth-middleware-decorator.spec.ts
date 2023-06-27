import { type HttpRequest, type Middleware } from '@/presentation/protocols'
import { type LogErrorRepository } from '@/data/protocols/repositories/log/log-error-repository'
import { LogAuthMiddlewareDecorator } from './log-auth-middleware-decorator'
import { ok } from '@/presentation/helpers/http/http-helper'
import { mockAuthMiddleware } from '@/presentation/_mocks/middleware-mocks'
import { mockLogErrorRepository } from '@/data/mocks'
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
  middlewareStub: Middleware
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const middlewareStub = mockAuthMiddleware()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogAuthMiddlewareDecorator(middlewareStub, logErrorRepositoryStub)

  return {
    sut,
    middlewareStub,
    logErrorRepositoryStub
  }
}

describe('Log Auth Middleware Decorator', () => {
  test('Should call middleware handle with correct value', async () => {
    const { sut, middlewareStub } = makeSut()
    const handleSpy = jest.spyOn(middlewareStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the middleware', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok('ok'))
  })

  test('Should call LogErrorRepository with correct error', async () => {
    const { sut, middlewareStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(middlewareStub, 'handle').mockReturnValueOnce(Promise.resolve(mockServerError()))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack', 'server')

    jest.spyOn(middlewareStub, 'handle').mockReturnValueOnce(Promise.resolve(mockJWTError()))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('jwt_stack', 'auth')

    jest.spyOn(middlewareStub, 'handle').mockReturnValueOnce(Promise.resolve(mockTokenExpiredError()))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('token-expired_stack', 'auth')

    jest.spyOn(middlewareStub, 'handle').mockReturnValueOnce(Promise.resolve(mockNotBeforeError()))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('NotBeforeError_stack', 'auth')
  })
})
