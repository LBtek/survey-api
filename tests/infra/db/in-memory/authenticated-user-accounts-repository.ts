import { mockAccount } from '#/domain/mocks/models'
import {
  type ILoadOwnAuthenticatedUserRepository,
  type IAuthenticateUserRepository,
  type IDeleteAccessTokenRepository,
  type IRefreshAccessTokenRepository,
  type AuthenticationRepository
} from '@/application/data/protocols/repositories'
import { InMemoryAuthenticatedUserAccountsRepository, authenticatedTokens, authenticatedUserAccounts } from '@/infra/db/in-memory/authenticated-user-accounts-repository'

const { password, ...userAccount } = mockAccount()

const mockAuthenticateData = (): AuthenticationRepository.AuthenticateUser.Params => ({
  ip: 'any_ip',
  accessToken: 'any_access_token',
  ...userAccount
})

const mockLoadUserData = (): AuthenticationRepository.LoadOwnUser.Params => {
  const { user, ...rest } = mockAuthenticateData()
  return {
    ...rest,
    userId: user.id
  }
}

describe('Authentication Repository', () => {
  describe('authenticate()', () => {
    test('Should authenticate the user successfully', async () => {
      const sut: IAuthenticateUserRepository = new InMemoryAuthenticatedUserAccountsRepository()
      const data = mockAuthenticateData()
      await sut.authenticate(data)
      const { user, ...rest } = userAccount
      expect(authenticatedTokens.get(data.accessToken)).toEqual({
        ...rest,
        userId: user.id
      })
      expect(authenticatedUserAccounts
        .get(user.id).accounts
        .get(data.accountId).ips
        .get(data.ip)
        .has(data.accessToken)
      ).toBe(true)
    })

    test('Should authenticate another account of the same user successfully', async () => {
      const sut: IAuthenticateUserRepository = new InMemoryAuthenticatedUserAccountsRepository()
      const data = mockAuthenticateData()
      const firstAccountId = data.accountId
      data.accountId = 'other_account_id'
      await sut.authenticate(data)
      const { user, ...rest } = userAccount
      expect(authenticatedTokens.get(data.accessToken)).toEqual({
        ...rest,
        accountId: 'other_account_id',
        userId: user.id
      })
      expect(authenticatedUserAccounts
        .get(user.id).accounts
        .get(firstAccountId).ips
        .get(data.ip)
        .has(data.accessToken)
      ).toBe(true)

      expect(authenticatedUserAccounts
        .get(user.id).accounts
        .get(data.accountId).ips
        .get(data.ip)
        .has(data.accessToken)
      ).toBe(true)
    })

    test('Should successfully authenticate the same account with another IP', async () => {
      const sut: IAuthenticateUserRepository = new InMemoryAuthenticatedUserAccountsRepository()
      const data = mockAuthenticateData()
      const firstIp = data.ip
      data.ip = 'other_ip'
      await sut.authenticate(data)
      const { user, ...rest } = userAccount
      expect(authenticatedTokens.get(data.accessToken)).toEqual({
        ...rest,
        userId: user.id
      })
      expect(authenticatedUserAccounts
        .get(user.id).accounts
        .get(data.accountId).ips
        .get(firstIp)
        .has(data.accessToken)
      ).toBe(true)

      expect(authenticatedUserAccounts
        .get(user.id).accounts
        .get(data.accountId).ips
        .get(data.ip)
        .has(data.accessToken)
      ).toBe(true)
    })
  })

  describe('loadOwnUser()', () => {
    test('Should load own user successfully', async () => {
      const sut: ILoadOwnAuthenticatedUserRepository = new InMemoryAuthenticatedUserAccountsRepository()
      const data = mockLoadUserData()
      const account = await sut.loadOwnUser(data)
      expect(account).toEqual(userAccount)
    })

    test('Should not load own user if user is not logged in', async () => {
      const sut: ILoadOwnAuthenticatedUserRepository & IDeleteAccessTokenRepository = new InMemoryAuthenticatedUserAccountsRepository()
      const data = mockLoadUserData()
      await sut.deleteAccessToken({ ip: data.ip, accessToken: data.accessToken })
      authenticatedUserAccounts.delete(data.userId)
      const account = await sut.loadOwnUser(data)
      expect(account).toBeNull()
    })
  })

  describe('deleteAccessToken()', () => {
    test('Should ensure that only the correct accessToken is deleted', async () => {
      const sut: IDeleteAccessTokenRepository & IAuthenticateUserRepository = new InMemoryAuthenticatedUserAccountsRepository()
      const { ip, accessToken, ...data } = mockLoadUserData()
      await sut.authenticate(mockAuthenticateData())
      const result = await sut.deleteAccessToken({ ip, accessToken })
      expect(result).toBe(true)
      expect(authenticatedTokens.get(accessToken)).toBeFalsy()
      expect(authenticatedUserAccounts
        .get(data.userId).accounts
        .get(data.accountId).ips
        .get(ip)
        .has(accessToken)
      ).toBe(false)
    })

    test('Should ensure deleteAccessToken returns false if token is not logged in', async () => {
      const sut: IDeleteAccessTokenRepository & IAuthenticateUserRepository = new InMemoryAuthenticatedUserAccountsRepository()
      const { ip, accessToken, ...data } = mockLoadUserData()
      const result = await sut.deleteAccessToken({ ip, accessToken })
      expect(result).toBe(false)
      expect(authenticatedTokens.get(accessToken)).toBeFalsy()
      expect(authenticatedUserAccounts
        .get(data.userId).accounts
        .get(data.accountId).ips
        .get(ip)
        .has(accessToken)
      ).toBe(false)
    })
  })

  describe('refreshToken()', () => {
    test('Should refresh token successfully', async () => {
      const sut: IRefreshAccessTokenRepository & IAuthenticateUserRepository = new InMemoryAuthenticatedUserAccountsRepository()
      await sut.authenticate(mockAuthenticateData())
      const { ip, accessToken, ...data } = mockLoadUserData()
      const result = await sut.refreshToken({
        ip,
        oldAccessToken: accessToken,
        newAccessToken: 'new_access_token',
        ...data
      })
      expect(result).toBe(true)
      expect(authenticatedTokens.get(accessToken)).toBeFalsy()
      expect(authenticatedTokens.get('new_access_token')).toEqual(data)
      expect(authenticatedUserAccounts
        .get(data.userId).accounts
        .get(data.accountId).ips
        .get(ip)
        .has(accessToken)
      ).toBe(false)
      expect(authenticatedUserAccounts
        .get(data.userId).accounts
        .get(data.accountId).ips
        .get(ip)
        .has('new_access_token')
      ).toBe(true)
    })

    test('Should ensure that an accessToken is not erroneously renewed', async () => {
      const sut: IRefreshAccessTokenRepository & ILoadOwnAuthenticatedUserRepository = new InMemoryAuthenticatedUserAccountsRepository()
      const { ip, accessToken, ...data } = mockLoadUserData()
      const result = await sut.refreshToken({
        ip,
        oldAccessToken: accessToken,
        newAccessToken: 'other_new_access_token',
        ...data
      })
      expect(result).toBe(false)
      expect(authenticatedTokens.get(accessToken)).toBeFalsy()
      expect(authenticatedTokens.get('other_new_access_token')).toBeFalsy()

      const loadData = mockLoadUserData()
      let account = await sut.loadOwnUser(loadData)
      expect(account).toBeNull()

      loadData.accessToken = 'other_new_access_token'
      account = await sut.loadOwnUser(loadData)
      expect(account).toBeNull()
    })
  })
})
