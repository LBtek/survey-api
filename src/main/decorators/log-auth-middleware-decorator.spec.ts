import { type HttpRequest, type HttpResponse, type Middleware } from '@/presentation/protocols'
import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { LogAuthMiddlewareDecorator } from './log-auth-middleware-decorator'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

const makeAuthMiddleware = (): Middleware => {
  class AuthMiddlewareStub implements Middleware {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => { resolve(ok('ok')) })
    }
  }
  return new AuthMiddlewareStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string, typeError: 'server' | 'auth'): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }
  }
  return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  },
  body: { any_value: 'any_value' }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeFakeJWTError = (): HttpResponse => {
  const fakeError = new JsonWebTokenError('jwt malformed')
  fakeError.stack = 'jwt_stack'
  return badRequest(fakeError)
}

const makeFakeTokenExpiredError = (): HttpResponse => {
  const fakeError = new TokenExpiredError('token expired', new Date())
  fakeError.stack = 'token-expired_stack'
  return badRequest(fakeError)
}

const makeFakeNotBeforeError = (): HttpResponse => {
  const fakeError = new NotBeforeError('error', new Date())
  fakeError.stack = 'NotBeforeError_stack'
  return badRequest(fakeError)
}

type SutTypes = {
  sut: LogAuthMiddlewareDecorator
  middlewareStub: Middleware
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const middlewareStub = makeAuthMiddleware()
  const logErrorRepositoryStub = makeLogErrorRepository()
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

    jest.spyOn(middlewareStub, 'handle').mockReturnValueOnce(new Promise(resolve => {
      resolve(makeFakeServerError())
    }))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack', 'server')

    jest.spyOn(middlewareStub, 'handle').mockReturnValueOnce(new Promise(resolve => {
      resolve(makeFakeJWTError())
    }))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('jwt_stack', 'auth')

    jest.spyOn(middlewareStub, 'handle').mockReturnValueOnce(new Promise(resolve => {
      resolve(makeFakeTokenExpiredError())
    }))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('token-expired_stack', 'auth')

    jest.spyOn(middlewareStub, 'handle').mockReturnValueOnce(new Promise(resolve => {
      resolve(makeFakeNotBeforeError())
    }))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('NotBeforeError_stack', 'auth')
  })
})
