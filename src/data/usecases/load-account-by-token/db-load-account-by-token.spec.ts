import { type TokenDecrypter } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call TokenDecrypter with correct value', async () => {
    class TokenDecrypterStub implements TokenDecrypter {
      async decrypt (value: string): Promise<string> {
        return null
      }
    }
    const decrypterStub = new TokenDecrypterStub()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const sut = new DbLoadAccountByToken(decrypterStub)
    await sut.loadByToken('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
