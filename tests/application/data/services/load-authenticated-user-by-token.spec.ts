import { type AuthenticationModel } from '@/application/models'
import { LoadAuthenticatedUserByToken } from '@/application/data/services'
import { LoadAuthenticatedUserRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockAccount } from '#/domain/mocks/models'

type SutTypes = {
  sut: LoadAuthenticatedUserByToken
  loadAuthenticatedUserRepository: LoadAuthenticatedUserRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAuthenticatedUserRepository = new LoadAuthenticatedUserRepositorySpy()
  const sut = new LoadAuthenticatedUserByToken(loadAuthenticatedUserRepository)
  return {
    sut,
    loadAuthenticatedUserRepository
  }
}

const mockData = (secondsToExpireToken: number = 0): AuthenticationModel.LoadUserByToken.Params => ({
  ip: 'any_ip',
  accessToken: 'any_token',
  roles: new Set().add('any_role') as AuthenticationModel.LoadUserByToken.Params['roles'],
  tokenPayload: {
    userId: 'any_user_id',
    accountId: 'any_account_id',
    role: 'any_role' as AuthenticationModel.AccessTokenPayload['role'],
    willExpireIn: Math.round(Date.now() / 1000) + secondsToExpireToken
  }
})

describe('LoadAuthenticatedUserByToken Application Service', () => {
  test('Should return null if the roleset does not contain the token role', async () => {
    const { sut } = makeSut()
    const data = mockData()
    data.tokenPayload.role = 'role_not_included' as AuthenticationModel.AccessTokenPayload['role']
    const account = await sut.loadByToken(data)
    expect(account).toBeNull()
  })

  test('Should call LoadAuthenticatedUserRepository with correct values', async () => {
    const { sut, loadAuthenticatedUserRepository } = makeSut()
    await sut.loadByToken(mockData())
    const { roles, tokenPayload, ...restData } = mockData()
    const { userId, accountId, role } = tokenPayload
    expect(loadAuthenticatedUserRepository.loadUserData).toEqual({
      userId,
      accountId,
      role,
      ...restData
    })
  })

  test('Should return null if LoadUserAccountByTokenRepository returns null', async () => {
    const { sut, loadAuthenticatedUserRepository } = makeSut()
    loadAuthenticatedUserRepository.loadOwnUser = async () => null
    const account = await sut.loadByToken(mockData())
    expect(account).toBeNull()
  })

  test('Should return an user on success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByToken(mockData())
    const { user, role, ...accountData } = mockAccount()
    expect(account).toEqual({ accountId: accountData.accountId, role, user })
  })

  test('Should throw if Roles is empty', async () => {
    const { sut } = makeSut()
    const promise = sut.loadByToken({ ...mockData(), roles: null })
    await expect(promise).rejects.toThrow()
    const promise2 = sut.loadByToken({ ...mockData(), roles: new Set() })
    await expect(promise2).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAuthenticatedUserRepository } = makeSut()
    loadAuthenticatedUserRepository.loadOwnUser = async () => { throw new Error() }
    const promise = sut.loadByToken(mockData())
    await expect(promise).rejects.toThrow()
  })
})
