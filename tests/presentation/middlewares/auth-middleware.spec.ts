import { type Account } from '@/application/entities'
import { type AuthenticationModel } from '@/application/models'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { AccessDeniedError } from '@/application/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadAuthenticatedUserByTokenSpy } from '../_mocks/services-mocks'
import { JsonWebTokenError } from 'jsonwebtoken'

const mockRequest = (): Omit<AuthenticationModel.LoadUserByToken.Params, 'roles'> => ({
  ip: 'any_ip',
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware
  loadAuthenticatedUserByTokenSpy: LoadAuthenticatedUserByTokenSpy
}

const makeSut = (roles: Set<string>): SutTypes => {
  const loadAuthenticatedUserByTokenSpy = new LoadAuthenticatedUserByTokenSpy()
  const sut = new AuthMiddleware(loadAuthenticatedUserByTokenSpy, roles as Set<Account.BaseDataModel.Roles>)
  return {
    sut,
    loadAuthenticatedUserByTokenSpy
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut(new Set())
    const httpResponse = await sut.handle(null)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const roles = new Set().add('any_role') as Set<Account.BaseDataModel.Roles>
    const { sut, loadAuthenticatedUserByTokenSpy } = makeSut(roles)
    await sut.handle(mockRequest())
    expect(loadAuthenticatedUserByTokenSpy.accessToken).toBe('any_token')
    expect(loadAuthenticatedUserByTokenSpy.roles).toBe(roles)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAuthenticatedUserByTokenSpy } = makeSut(new Set())
    jest.spyOn(loadAuthenticatedUserByTokenSpy, 'loadByToken').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut(new Set())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_account_id', userId: 'any_user_id' }))
  })

  test('Should return 400 or 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAuthenticatedUserByTokenSpy } = makeSut(new Set())
    jest.spyOn(loadAuthenticatedUserByTokenSpy, 'loadByToken').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    let httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))

    jest.spyOn(loadAuthenticatedUserByTokenSpy, 'loadByToken').mockReturnValueOnce(
      Promise.reject(new JsonWebTokenError('jwt malformed'))
    )
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new JsonWebTokenError('jwt malformed')))
  })
})
