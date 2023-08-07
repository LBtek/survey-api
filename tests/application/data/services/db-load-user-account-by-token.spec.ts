import { DbLoadUserByAccountAccessToken } from '@/application/data/services'
import { TokenDecrypterSpy } from '#/application/data/mocks/criptography-mocks'
import { LoadUserAccountByTokenRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockAccount } from '#/domain/mocks/models'

type SutTypes = {
  sut: DbLoadUserByAccountAccessToken
  tokenDecrypterSpy: TokenDecrypterSpy
  loadUserAccountByTokenRepositorySpy: LoadUserAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const tokenDecrypterSpy = new TokenDecrypterSpy()
  const loadUserAccountByTokenRepositorySpy = new LoadUserAccountByTokenRepositorySpy()
  const sut = new DbLoadUserByAccountAccessToken(tokenDecrypterSpy, loadUserAccountByTokenRepositorySpy)
  return {
    sut,
    tokenDecrypterSpy,
    loadUserAccountByTokenRepositorySpy
  }
}

describe('DbLoadAccountByToken Application Service', () => {
  test('Should call TokenDecrypter with correct value', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    await sut.loadByToken({ accessToken: 'any_token', role: 'any_role' })
    expect(tokenDecrypterSpy.token).toBe('any_token')
  })

  test('Should return null if TokenDecrypter returns null', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    jest.spyOn(tokenDecrypterSpy, 'decrypt').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const account = await sut.loadByToken({ accessToken: 'any_token', role: 'any_role' })
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadUserAccountByTokenRepositorySpy } = makeSut()
    await sut.loadByToken({ accessToken: 'any_token', role: 'any_role' })
    expect(loadUserAccountByTokenRepositorySpy.token).toBe('any_token')
    expect(loadUserAccountByTokenRepositorySpy.role).toBe('any_role')
  })

  test('Should return null if LoadUserAccountByTokenRepository returns null', async () => {
    const { sut, loadUserAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadUserAccountByTokenRepositorySpy, 'loadByToken').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const account = await sut.loadByToken({ accessToken: 'any_token', role: 'any_role' })
    expect(account).toBeNull()
  })

  test('Should return an user on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByToken({ accessToken: 'any_token', role: 'any_role' })
    const { user, ...accountData } = mockAccount()
    expect(account).toEqual({ accountId: accountData.accountId, ...user })
  })

  test('Should throw if TokenDecrypter throws', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    jest.spyOn(tokenDecrypterSpy, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.loadByToken({ accessToken: 'any_token', role: 'any_role' })
    await expect(promisse).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadUserAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadUserAccountByTokenRepositorySpy, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.loadByToken({ accessToken: 'any_token', role: 'any_role' })
    await expect(promisse).rejects.toThrow()
  })
})
