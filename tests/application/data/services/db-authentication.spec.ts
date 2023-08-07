import { type AuthResult } from '@/presentation/protocols'
import { DbAuthentication } from '@/application/data/services'
import { HashComparerSpy, TokenGeneratorSpy } from '#/application/data/mocks/criptography-mocks'
import { LoadUserAccountByEmailRepositorySpy, UpdateAccessTokenRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockAccount, mockAuthenticationParams } from '#/domain/mocks/models'
import { UnauthorizedError } from '@/application/errors'

type SutTypes = {
  sut: DbAuthentication
  loadUserAccountByEmailRepositorySpy: LoadUserAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  tokenGeneratorSpy: TokenGeneratorSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadUserAccountByEmailRepositorySpy = new LoadUserAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(
    loadUserAccountByEmailRepositorySpy,
    hashComparerSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  )

  return {
    sut,
    loadUserAccountByEmailRepositorySpy,
    hashComparerSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadUserAccountByEmailRepositorySpy } = makeSut()
    const authenticationData = mockAuthenticationParams()
    await sut.auth(authenticationData)
    expect(loadUserAccountByEmailRepositorySpy.email).toBe(authenticationData.email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadUserAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadUserAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return UnauthorizedError if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadUserAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadUserAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const authenticationResult = await sut.auth(mockAuthenticationParams())
    expect(authenticationResult).toEqual(new UnauthorizedError())
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy } = makeSut()
    const authenticationData = mockAuthenticationParams()
    await sut.auth(authenticationData)
    expect(hashComparerSpy.plaintext).toBe(authenticationData.password)
    expect(hashComparerSpy.hash).toBe('hash')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return UnauthorizedError if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(
      Promise.resolve(false)
    )
    const authenticationResult = await sut.auth(mockAuthenticationParams())
    expect(authenticationResult).toEqual(new UnauthorizedError())
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const account = mockAccount()
    await sut.auth(mockAuthenticationParams())
    expect(tokenGeneratorSpy.content).toBe(account.accountId)
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    jest.spyOn(tokenGeneratorSpy, 'generate').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an authenticationResult on success', async () => {
    const { sut, tokenGeneratorSpy, loadUserAccountByEmailRepositorySpy } = makeSut()
    const { username, accessToken } = await sut.auth(mockAuthenticationParams()) as AuthResult
    expect(username).toBe(loadUserAccountByEmailRepositorySpy.account.user.name)
    expect(accessToken).toBe(tokenGeneratorSpy.token)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    const account = mockAccount()
    await sut.auth(mockAuthenticationParams())
    expect(updateAccessTokenRepositorySpy.id).toBe(account.accountId)
    expect(updateAccessTokenRepositorySpy.token).toBe('any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
