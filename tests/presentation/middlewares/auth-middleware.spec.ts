import { type Account } from '@/application/entities'
import { type AuthenticationModel } from '@/application/models'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { AccessDeniedError, InvalidTokenPayload, UnauthorizedError } from '@/application/errors'
import { badRequest, forbidden, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { CheckAndRefreshAccessTokenSpy, ExtractAccessTokenPayloadSpy, LoadAuthenticatedUserByTokenSpy } from '../_mocks/services-mocks'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'

const mockRequest = (): Omit<AuthenticationModel.LoadUserByToken.Params, 'roles' | 'tokenPayload'> => ({
  ip: 'any_ip',
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware
  extractAccessTokenPayloadSpy: ExtractAccessTokenPayloadSpy
  loadAuthenticatedUserByTokenSpy: LoadAuthenticatedUserByTokenSpy
  checkAndRefreshAccessTokenSpy: CheckAndRefreshAccessTokenSpy
}

const makeSut = (roles: Set<string>): SutTypes => {
  const extractAccessTokenPayloadSpy = new ExtractAccessTokenPayloadSpy()
  const loadAuthenticatedUserByTokenSpy = new LoadAuthenticatedUserByTokenSpy()
  const checkAndRefreshAccessTokenSpy = new CheckAndRefreshAccessTokenSpy()
  const sut = new AuthMiddleware(extractAccessTokenPayloadSpy, loadAuthenticatedUserByTokenSpy, checkAndRefreshAccessTokenSpy, roles as Set<Account.BaseDataModel.Roles>)
  return {
    sut,
    extractAccessTokenPayloadSpy,
    loadAuthenticatedUserByTokenSpy,
    checkAndRefreshAccessTokenSpy
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut(new Set())
    const httpResponse = await sut.handle(null)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call ExtractAccessTokenPayload with correct data', async () => {
    const roles = new Set().add('any_role') as Set<Account.BaseDataModel.Roles>
    const { sut, extractAccessTokenPayloadSpy } = makeSut(roles)
    const request = mockRequest()
    await sut.handle(request)
    expect(extractAccessTokenPayloadSpy.extractData).toEqual(request)
  })

  test('Should call LoadAccountByToken with correct data', async () => {
    const roles = new Set().add('any_role') as Set<Account.BaseDataModel.Roles>
    const { sut, loadAuthenticatedUserByTokenSpy, extractAccessTokenPayloadSpy } = makeSut(roles)
    await sut.handle(mockRequest())
    const tokenPayload = extractAccessTokenPayloadSpy.extractResult
    expect(loadAuthenticatedUserByTokenSpy.loadData).toEqual({ ...mockRequest(), roles, tokenPayload })
  })

  test('Should call LoadAccountByToken with correct data if no roles are provided', async () => {
    const roles = new Set<string>()
    const { sut, loadAuthenticatedUserByTokenSpy, extractAccessTokenPayloadSpy } = makeSut(roles)
    await sut.handle(mockRequest())
    const tokenPayload = extractAccessTokenPayloadSpy.extractResult
    const basicRole = new Set<Account.BaseDataModel.Roles>().add('basic_user')
    expect(loadAuthenticatedUserByTokenSpy.loadData).toEqual({ ...mockRequest(), roles: basicRole, tokenPayload })
  })

  test('Should call CheckAndRefreshToken with correct value', async () => {
    const roles = new Set().add('any_role') as Set<Account.BaseDataModel.Roles>
    const { sut, checkAndRefreshAccessTokenSpy, extractAccessTokenPayloadSpy } = makeSut(roles)
    await sut.handle(mockRequest())
    const tokenPayload = extractAccessTokenPayloadSpy.extractResult
    expect(checkAndRefreshAccessTokenSpy.checkAndRefreshData).toEqual({
      ...mockRequest(),
      tokenPayload
    })
  })

  test('Should return 400 or 401 or 403 if ExtractAccessTokenPayload throws', async () => {
    const { sut, extractAccessTokenPayloadSpy } = makeSut(new Set())

    extractAccessTokenPayloadSpy.extract = async () => { throw new JsonWebTokenError('jwt malformed') }
    let httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new JsonWebTokenError('jwt malformed')))

    extractAccessTokenPayloadSpy.extract = async () => { throw new InvalidTokenPayload() }
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidTokenPayload()))

    extractAccessTokenPayloadSpy.extract = async () => { throw new TokenExpiredError('jwt expirou', new Date()) }
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())

    extractAccessTokenPayloadSpy.extract = async () => { throw new AccessDeniedError() }
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))

    extractAccessTokenPayloadSpy.extract = async () => { throw new NotBeforeError('etc...', new Date()) }
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAuthenticatedUserByTokenSpy } = makeSut(new Set())
    loadAuthenticatedUserByTokenSpy.loadByToken = async () => null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 401 if CheckAndRefreshToken throw an UnauthorizedError', async () => {
    const { sut, checkAndRefreshAccessTokenSpy } = makeSut(new Set())
    checkAndRefreshAccessTokenSpy.checkAndRefresh = async () => { throw new UnauthorizedError() }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if any service throws a server Error', async () => {
    const { sut, extractAccessTokenPayloadSpy, loadAuthenticatedUserByTokenSpy, checkAndRefreshAccessTokenSpy } = makeSut(new Set())

    extractAccessTokenPayloadSpy.extract = async () => { throw new Error() }
    let httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))

    loadAuthenticatedUserByTokenSpy.loadByToken = async () => { throw new Error() }
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))

    checkAndRefreshAccessTokenSpy.checkAndRefresh = async () => { throw new Error() }
    httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut, checkAndRefreshAccessTokenSpy } = makeSut(new Set())
    checkAndRefreshAccessTokenSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_account_id', userId: 'any_user_id', role: 'any_role' }))
  })

  test('Should return 200 with newAccessToken if token update', async () => {
    const { sut } = makeSut(new Set())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      accountId: 'any_account_id',
      userId: 'any_user_id',
      role: 'any_role',
      newAccessToken: 'new_access_token'
    }))
  })
})
