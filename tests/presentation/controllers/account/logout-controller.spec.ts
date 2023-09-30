import { type AuthenticationModel } from '@/application/models'
import { LogoutController } from '@/presentation/controllers'
import { DeleteAccessTokenRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { noContent, serverError } from '@/presentation/helpers/http/http-helper'

const mockRequest = (): AuthenticationModel.Logout.Params => ({
  ip: 'any_ip',
  accessToken: 'any_access_token'
})

type SutTypes = {
  sut: LogoutController
  deleteAccessTokenRepositorySpy: DeleteAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const deleteAccessTokenRepositorySpy = new DeleteAccessTokenRepositorySpy()
  const sut = new LogoutController(deleteAccessTokenRepositorySpy)
  return {
    sut,
    deleteAccessTokenRepositorySpy
  }
}

describe('Logout Controller', () => {
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
