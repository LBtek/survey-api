import { type LogErrorRepository } from '@/data/protocols/repositories/log/log-error-repository'
import { type Controller, type HttpRequest } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers/http/http-helper'
import { LogControllerDecorator } from './log-controller-decorator'
import { mockLogErrorRepository } from '@/data/mocks'
import { mockAccount, mockAddAccountParams } from '@/domain/models/mocks'
import { mockController, mockServerError } from '@/presentation/_mocks'

const mockRequest = (): HttpRequest => ({
  body: {
    ...mockAddAccountParams(),
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(mockRequest())
    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(mockServerError()))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    await sut.handle(mockRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack', 'server')
  })
})
