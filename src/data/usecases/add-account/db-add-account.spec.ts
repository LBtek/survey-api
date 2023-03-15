import { type Hasher } from '../../protocols/hasher'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    class HasherStub implements Hasher {
      async hash (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_password') })
      }
    }
    const hasherStub = new HasherStub()
    const sut = new DbAddAccount(hasherStub)
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
