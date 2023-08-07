import { DbAddUserAccount } from '@/application/data/usecases/account'
import { HasherSpy } from '#/application/data/mocks/criptography-mocks'
import { AddAccountRepositorySpy, CheckUserAccountByEmailRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockAccount, mockAddAccountParams } from '#/domain/mocks/models'
import { EmailInUserError } from '@/domain/errors'

type SutTypes = {
  sut: DbAddUserAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkUserAccountByEmailRepositorySpy: CheckUserAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const checkUserAccountByEmailRepositorySpy = new CheckUserAccountByEmailRepositorySpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddUserAccount(hasherSpy, addAccountRepositorySpy, checkUserAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkUserAccountByEmailRepositorySpy
  }
}

describe('DbAddUserAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountData = mockAddAccountParams()
    await sut.add(addAccountData)
    expect(hasherSpy.plaintext).toBe(addAccountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.add(mockAddAccountParams())
    await expect(promisse).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    const addAccountData = mockAddAccountParams()
    await sut.add(addAccountData)
    expect(addAccountRepositorySpy.addAccountData).toEqual({ ...addAccountData, password: 'hash' })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.add(mockAddAccountParams())
    await expect(promisse).rejects.toThrow()
  })

  test('Should return an "Ok" if the account is successfully added', async () => {
    const { sut } = makeSut()
    const addAccountData = mockAddAccountParams()
    const account = await sut.add(addAccountData)
    expect(account).toEqual('Ok')
  })

  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkUserAccountByEmailRepositorySpy } = makeSut()
    const account = mockAccount()
    await sut.add(mockAddAccountParams())
    expect(checkUserAccountByEmailRepositorySpy.email).toBe(account.user.email)
  })

  test('Should return EmailInUserError if CheckAccountByEmailRepository return true', async () => {
    const { sut, checkUserAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(checkUserAccountByEmailRepositorySpy, 'checkByEmail').mockReturnValueOnce(
      Promise.resolve(true)
    )
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(new EmailInUserError())
  })
})
