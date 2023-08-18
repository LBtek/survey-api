import { type Account } from '@/application/entities'
import { type Authentication } from '@/application/models'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { AccessDeniedError } from '@/application/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadUserByAccountAccessTokenSpy } from '../_mocks/services-mocks'
import { JsonWebTokenError } from 'jsonwebtoken'

const mockRequest = (): Authentication.LoadUserByToken.Params => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware
  loadUserByAccountAccessTokenSpy: LoadUserByAccountAccessTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadUserByAccountAccessTokenSpy = new LoadUserByAccountAccessTokenSpy()
  const sut = new AuthMiddleware(loadUserByAccountAccessTokenSpy, role as Account.BaseDataModel.Roles)
  return {
    sut,
    loadUserByAccountAccessTokenSpy
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(null)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadUserByAccountAccessTokenSpy } = makeSut(role)
    await sut.handle(mockRequest())
    expect(loadUserByAccountAccessTokenSpy.accessToken).toBe('any_token')
    expect(loadUserByAccountAccessTokenSpy.role).toBe(role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadUserByAccountAccessTokenSpy } = makeSut()
    jest.spyOn(loadUserByAccountAccessTokenSpy, 'loadByToken').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_account_id' }))
  })

  test('Should return 400 or 500 if LoadAccountByToken throws', async () => {
    const { sut, loadUserByAccountAccessTokenSpy } = makeSut()
    jest.spyOn(loadUserByAccountAccessTokenSpy, 'loadByToken').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    let httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))

    jest.spyOn(loadUserByAccountAccessTokenSpy, 'loadByToken').mockReturnValueOnce(
      Promise.reject(new JsonWebTokenError('jwt malformed'))
    )
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new JsonWebTokenError('jwt malformed')))
  })
})
