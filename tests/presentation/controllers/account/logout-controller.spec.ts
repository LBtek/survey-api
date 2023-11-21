import { type AuthenticationModel } from '@/application/models'
import { InvalidParamError } from '@/presentation/errors'
import { LogoutController } from '@/presentation/controllers'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { DeleteAccessTokenRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { ValidationSpy } from '#/presentation/_mocks'

const mockRequest = (): AuthenticationModel.Logout.Params => ({
  ip: 'any_ip',
  accessToken: 'any_access_token'
})

type SutTypes = {
  sut: LogoutController
  validationSpy: ValidationSpy
  deleteAccessTokenRepositorySpy: DeleteAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const deleteAccessTokenRepositorySpy = new DeleteAccessTokenRepositorySpy()
  const sut = new LogoutController(deleteAccessTokenRepositorySpy, validationSpy)
  return {
    sut,
    validationSpy,
    deleteAccessTokenRepositorySpy
  }
}

describe('Logout Controller', () => {
  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toBe(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new InvalidParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('any_field')))
  })

  test('Should call DeleteAccessTokenRepository with correct values', async () => {
    const { sut, deleteAccessTokenRepositorySpy } = makeSut()
    await sut.handle(mockRequest())
    expect(deleteAccessTokenRepositorySpy.deleteAccessTokenData).toEqual(mockRequest())
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if DeleteAccessTokenRepository throws', async () => {
    const { sut, deleteAccessTokenRepositorySpy } = makeSut()
    deleteAccessTokenRepositorySpy.deleteAccessToken = async () => { throw new Error() }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
