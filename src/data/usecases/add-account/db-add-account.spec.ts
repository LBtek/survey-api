import { type Hasher } from '../../protocols/hasher'
import { DbAddAccount } from './db-add-account'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new HasherStub()
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const sut = new DbAddAccount(hasherStub)
  return {
    sut,
    hasherStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })
})
