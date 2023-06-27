import { type AddAccountRepository, type Hasher, type LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccount, mockAddAccountParams } from '@/domain/models/mocks'
import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '@/data/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValue(null)
  const addAccountRepositoryStub = mockAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAddAccountParams())
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.add(mockAddAccountParams())
    await expect(promisse).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith(mockAddAccountParams())
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.add(mockAddAccountParams())
    await expect(promisse).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(mockAccount())
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccount())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(mockAccount())
    )
    const account = await sut.add(mockAddAccountParams())
    expect(account).toBeNull()
  })
})
