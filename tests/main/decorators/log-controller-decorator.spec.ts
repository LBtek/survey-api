import { type HttpRequest } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers/http/http-helper'
import { LogControllerDecorator } from '@/main/decorators'
import { ControllerSpy, mockServerError } from '#/presentation/_mocks'
import { mockAccount, mockAddAccountParams } from '#/domain/mocks/models'
import { LogErrorRepositorySpy } from '#/application/data/mocks/repository-mocks'

const mockRequest = (): HttpRequest => ({
  body: {
    ...mockAddAccountParams(),
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)

  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle with correct value', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(controllerSpy.httpRequest).toEqual(request)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const account = mockAccount()
    controllerSpy.bodyResponse = account
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(account))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    jest.spyOn(controllerSpy, 'handle').mockReturnValueOnce(Promise.resolve(mockServerError()))
    await sut.handle(mockRequest())
    expect(logErrorRepositorySpy.stack).toBe('any_stack')
    expect(logErrorRepositorySpy.typeError).toBe('server')
  })
})
