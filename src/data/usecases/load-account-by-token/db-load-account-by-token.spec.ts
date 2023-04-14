import { type TokenDecrypter } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeTokenDecrypter = (): TokenDecrypter => {
  class TokenDecrypterStub implements TokenDecrypter {
    async decrypt (value: string): Promise<string> {
      return null
    }
  }
  return new TokenDecrypterStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  tokenDecrypterStub: TokenDecrypter
}

const makeSut = (): SutTypes => {
  const tokenDecrypterStub = makeTokenDecrypter()
  const sut = new DbLoadAccountByToken(tokenDecrypterStub)
  return {
    sut,
    tokenDecrypterStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call TokenDecrypter with correct value', async () => {
    const { sut, tokenDecrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(tokenDecrypterStub, 'decrypt')
    await sut.loadByToken('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
