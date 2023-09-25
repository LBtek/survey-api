import { type AuthenticationModel } from '@/application/models'
import { CheckAndRefreshAccessToken } from '@/application/data/services'
import { TokenGeneratorSpy } from '../mocks/criptography-mocks'
import { RefreshAccessTokenRepositorySpy } from '../mocks/repository-mocks'
import { UnauthorizedError } from '@/application/errors'

type SutTypes = {
  sut: CheckAndRefreshAccessToken
  tokenGeneratorSpy: TokenGeneratorSpy
  refreshAccessTokenRepositorySpy: RefreshAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  const refreshAccessTokenRepositorySpy = new RefreshAccessTokenRepositorySpy()
  const sut = new CheckAndRefreshAccessToken(
    tokenGeneratorSpy,
    refreshAccessTokenRepositorySpy
  )

  return {
    sut,
    tokenGeneratorSpy,
    refreshAccessTokenRepositorySpy
  }
}

const mockData = (secondsToExpireToken: number = 0): AuthenticationModel.CheckAndRefreshToken.Params => ({
  ip: 'any_ip',
  accessToken: 'any_access_token',
  tokenPayload: {
    userId: 'any_user_id',
    accountId: 'any_account_id',
    role: 'any_role' as AuthenticationModel.AccessTokenPayload['role'],
    willExpireIn: Math.round(Date.now() / 1000) + secondsToExpireToken
  }
})

describe('CheckAndRefreshToken Application Service', () => {
  test('Should return null if token is not expired', async () => {
    const { sut } = makeSut()
    const result = await sut.checkAndRefresh(mockData(180))
    expect(result).toBeNull()
  })

  test('Should call TokenGenerator with correct payload and should call RefreshToken with correct data', async () => {
    const { sut, tokenGeneratorSpy, refreshAccessTokenRepositorySpy } = makeSut()
    tokenGeneratorSpy.token = 'new_access_token'
    const { ip, tokenPayload } = mockData()
    const { accountId, userId, role } = tokenPayload
    await sut.checkAndRefresh(mockData())
    expect(tokenGeneratorSpy.content).toEqual({
      accountId,
      userId,
      role
    })
    expect(refreshAccessTokenRepositorySpy.refreshTokenData).toEqual({
      ip,
      oldAccessToken: 'any_access_token',
      newAccessToken: 'new_access_token',
      userId,
      accountId,
      role
    })
  })

  test('Should throw UnauthorizedError if user account is not authenticated', async () => {
    const { sut, refreshAccessTokenRepositorySpy } = makeSut()
    refreshAccessTokenRepositorySpy.result = false
    const promise = sut.checkAndRefresh(mockData())
    await expect(promise).rejects.toEqual(new UnauthorizedError())
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    tokenGeneratorSpy.generate = async () => { throw new Error() }
    const promise = sut.checkAndRefresh(mockData())
    await expect(promise).rejects.toEqual(new Error())
  })

  test('Should throw if RefreshToken throws', async () => {
    const { sut, refreshAccessTokenRepositorySpy } = makeSut()
    refreshAccessTokenRepositorySpy.refreshToken = async () => { throw new Error() }
    const promise = sut.checkAndRefresh(mockData())
    await expect(promise).rejects.toEqual(new Error())
  })
})
