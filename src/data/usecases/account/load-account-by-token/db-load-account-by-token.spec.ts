import { DbLoadAccountByToken } from './db-load-account-by-token'
import { mockAccount } from '@/domain/models/mocks'
import { LoadAccountByTokenRepositorySpy, TokenDecrypterSpy } from '@/data/mocks'

type SutTypes = {
  sut: DbLoadAccountByToken
  tokenDecrypterSpy: TokenDecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const tokenDecrypterSpy = new TokenDecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(tokenDecrypterSpy, loadAccountByTokenRepositorySpy)
  return {
    sut,
    tokenDecrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call TokenDecrypter with correct value', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    await sut.loadByToken('any_token', 'any_role')
    expect(tokenDecrypterSpy.token).toBe('any_token')
  })

  test('Should return null if TokenDecrypter returns null', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    jest.spyOn(tokenDecrypterSpy, 'decrypt').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    await sut.loadByToken('any_token', 'any_role')
    expect(loadAccountByTokenRepositorySpy.token).toBe('any_token')
    expect(loadAccountByTokenRepositorySpy.role).toBe('any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return an account success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toEqual(mockAccount())
  })

  test('Should throw if TokenDecrypter throws', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    jest.spyOn(tokenDecrypterSpy, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.loadByToken('any_token', 'any_role')
    await expect(promisse).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.loadByToken('any_token', 'any_role')
    await expect(promisse).rejects.toThrow()
  })
})
