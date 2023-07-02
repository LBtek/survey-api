import { type LoadAccountByTokenRepository, type TokenDecrypter } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { mockAccount } from '@/domain/models/mocks'
import { mockLoadAccountByTokenRepository, mockTokenDecrypter } from '@/data/mocks'

type SutTypes = {
  sut: DbLoadAccountByToken
  tokenDecrypterStub: TokenDecrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const tokenDecrypterStub = mockTokenDecrypter()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(tokenDecrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    tokenDecrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call TokenDecrypter with correct value', async () => {
    const { sut, tokenDecrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(tokenDecrypterStub, 'decrypt')
    await sut.loadByToken('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if TokenDecrypter returns null', async () => {
    const { sut, tokenDecrypterStub } = makeSut()
    jest.spyOn(tokenDecrypterStub, 'decrypt').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.loadByToken('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(
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
    const { sut, tokenDecrypterStub } = makeSut()
    jest.spyOn(tokenDecrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.loadByToken('any_token', 'any_role')
    await expect(promisse).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.loadByToken('any_token', 'any_role')
    await expect(promisse).rejects.toThrow()
  })
})
