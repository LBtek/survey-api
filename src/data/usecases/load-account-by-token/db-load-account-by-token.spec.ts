import { type LoadAccountByTokenRepository, type AccountModel, type TokenDecrypter } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeTokenDecrypter = (): TokenDecrypter => {
  class TokenDecrypterStub implements TokenDecrypter {
    async decrypt (token: string): Promise<string> {
      return 'any_value'
    }
  }
  return new TokenDecrypterStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  tokenDecrypterStub: TokenDecrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const tokenDecrypterStub = makeTokenDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
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
      new Promise(resolve => { resolve(null) })
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
      new Promise(resolve => { resolve(null) })
    )
    const account = await sut.loadByToken('any_token', 'any_role')
    expect(account).toBeNull()
  })
})
