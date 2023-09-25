import { JwtAdapter } from '@/infra/criptography'
import MockDate from 'mockdate'
import jwt from 'jsonwebtoken'

const TOKEN = 'any_token'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => TOKEN,
  verify: (): string => 'any_value'
}))

const SECRET = 'secret'

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(SECRET)
}

const payload = {
  accountId: 'any_account_id',
  userId: 'any_user_id',
  role: 'any_role'
}

const expiresIn = (): number => Math.ceil(Date.now() / 1000) + (60 * 60)

describe('Jwt Adapter', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.generate(payload)
      expect(signSpy).toHaveBeenCalledWith(
        { ...payload, willExpireIn: expiresIn() },
        SECRET,
        { expiresIn: (60 * 60 * 3) }
      )
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.generate(payload)
      expect(accessToken).toBe(TOKEN)
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.generate(payload)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt(TOKEN)
      expect(verifySpy).toHaveBeenCalledWith(TOKEN, SECRET)
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      const accessToken = await sut.decrypt(TOKEN)
      expect(accessToken).toBe('any_value')
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt(TOKEN)
      await expect(promise).rejects.toThrow()
    })
  })
})
