import { ExtractAccessTokenPayload } from '@/application/data/services'
import { TokenDecrypterSpy } from '../mocks/criptography-mocks'
import { DeleteAccessTokenRepositorySpy } from '../mocks/repository-mocks'
import { TokenExpiredError } from '@/infra/errors'

type SutTypes = {
  sut: ExtractAccessTokenPayload
  tokenDecrypterSpy: TokenDecrypterSpy
  deleteAccessTokenRepositorySpy: DeleteAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const tokenDecrypterSpy = new TokenDecrypterSpy()
  const deleteAccessTokenRepositorySpy = new DeleteAccessTokenRepositorySpy()
  const sut = new ExtractAccessTokenPayload(
    tokenDecrypterSpy,
    deleteAccessTokenRepositorySpy
  )

  return {
    sut,
    tokenDecrypterSpy,
    deleteAccessTokenRepositorySpy
  }
}

const ip = 'any_ip'
const accessToken = 'any_access_token'

describe('ExtractAccessTokenPayload Application Service', () => {
  test('Should call TokenDecrypter with correct token', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    tokenDecrypterSpy.decrypted.role = 'basic_user'
    await sut.extract({ ip, accessToken })
    expect(tokenDecrypterSpy.token === accessToken)
  })

  test('Should call DeleteAccessTokenRepository with correct values if TokenDecrypter throw a TokenExpiredError', async () => {
    const { sut, tokenDecrypterSpy, deleteAccessTokenRepositorySpy } = makeSut()
    const error = new TokenExpiredError('token expirou', new Date())
    tokenDecrypterSpy.decrypt = async () => { throw error }
    const promise = sut.extract({ ip, accessToken })

    await expect(promise).rejects.toThrow(error)
    expect(deleteAccessTokenRepositorySpy.deleteAccessTokenData).toEqual({ ip, accessToken })
  })

  test('Should return token payload on success', async () => {
    const { sut, tokenDecrypterSpy } = makeSut()
    tokenDecrypterSpy.decrypted.role = 'basic_user'
    const payload = await sut.extract({ ip, accessToken })
    expect(payload).toEqual(tokenDecrypterSpy.decrypted)
  })
})
