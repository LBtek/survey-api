import { type AuthenticationModel } from '@/application/models'
import { LoadAuthenticatedUserByToken } from '@/application/data/services'
import { TokenDecrypterSpy } from '#/application/data/mocks/criptography-mocks'
import { LoadUserAccountByTokenRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockAccount } from '#/domain/mocks/models'

type SutTypes = {
  sut: LoadAuthenticatedUserByToken
  tokenDecrypterSpy: TokenDecrypterSpy
  loadUserAccountByTokenRepositorySpy: LoadUserAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const tokenDecrypterSpy = new TokenDecrypterSpy()
  const loadUserAccountByTokenRepositorySpy = new LoadUserAccountByTokenRepositorySpy()
  const sut = new LoadAuthenticatedUserByToken(tokenDecrypterSpy, loadUserAccountByTokenRepositorySpy)
  return {
    sut,
    tokenDecrypterSpy,
    loadUserAccountByTokenRepositorySpy
  }
}

const loadByTokenData: AuthenticationModel.LoadUserByToken.Params = {
  ip: 'any_ip',
  accessToken: 'any_token',
  roles: new Set().add('any_role') as AuthenticationModel.LoadUserByToken.Params['roles']
}

describe('DbLoadAccountByToken Application Service', () => {
  test('Should call TokenDecrypter with correct value', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    await sut.loadByToken(loadByTokenData)
    expect(tokenDecrypterSpy.token).toBe('any_token')
  })

  test('Should return null if TokenDecrypter returns null', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    jest.spyOn(tokenDecrypterSpy, 'decrypt').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const account = await sut.loadByToken(loadByTokenData)
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadUserAccountByTokenRepositorySpy } = makeSut()
    await sut.loadByToken(loadByTokenData)
    const { roles, ...restData } = loadByTokenData
    expect(loadUserAccountByTokenRepositorySpy.loadUserData).toEqual({
      userId: 'any_user_id',
      ...restData,
      role: 'any_role'
    })
  })

  test('Should return null if LoadUserAccountByTokenRepository returns null', async () => {
    const { sut, loadUserAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadUserAccountByTokenRepositorySpy, 'loadUser').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const account = await sut.loadByToken(loadByTokenData)
    expect(account).toBeNull()
  })

  test('Should return an user on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByToken(loadByTokenData)
    const { user, ...accountData } = mockAccount()
    expect(account).toEqual({ accountId: accountData.accountId, user })
  })

  test('Should throw if TokenDecrypter throws', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    jest.spyOn(tokenDecrypterSpy, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.loadByToken(loadByTokenData)
    await expect(promisse).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadUserAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadUserAccountByTokenRepositorySpy, 'loadUser').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.loadByToken(loadByTokenData)
    await expect(promisse).rejects.toThrow()
  })
})
