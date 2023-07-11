import { DbAddAccount } from './db-add-account'
import { mockAccount, mockAddAccountParams } from '@/domain/models/mocks'
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/data/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.account = null
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
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

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const addAccountData = mockAddAccountParams()
    const account = await sut.add(addAccountData)
    expect(account).toEqual(mockAccount())
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const account = mockAccount()
    await sut.add(mockAddAccountParams())
    expect(loadAccountByEmailRepositorySpy.email).toBe(account.email)
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(mockAccount())
    )
    const account = await sut.add(mockAddAccountParams())
    expect(account).toBeNull()
  })
})
