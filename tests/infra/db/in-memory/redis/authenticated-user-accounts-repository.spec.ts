import { mockAccount } from '#/domain/mocks/models'
import {
  type IAuthenticateUserRepository,
  type AuthenticationRepository,
  type ILoadOwnAuthenticatedUserRepository,
  type IDeleteAccessTokenRepository,
  type IRefreshAccessTokenRepository
} from '@/application/data/protocols/repositories'
import { RedisAuthenticatedUserAccountsRepository, RedisClient } from '@/infra/db/in-memory/redis'

const sleep = async (delay: number): Promise<void> => { await new Promise((resolve) => setTimeout(resolve, delay)) }

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
  beforeAll(async () => {
    await RedisClient.connect()
  })

  afterAll(async () => {
    await RedisClient.flushDb()
    await RedisClient.disconnect()
  })

  describe('authenticate()', () => {
    test('Should ', async () => {
      const sut: IAuthenticateUserRepository = new RedisAuthenticatedUserAccountsRepository()
      const data = mockAuthenticateData()
      await sut.authenticate(data)
      const { user, ...rest } = userAccount
      await sleep(200)
      expect(await RedisClient.hGetAll(`token:${data.accessToken}`)).toEqual({
        ...rest,
        userId: user.id
      })
      const authUser = await RedisClient.hGetAll(`auth_usr:${user.id}`)
      const authAcc = await RedisClient.hGetAll(`auth_acc:${rest.accountId}`)
      expect(authUser).toEqual({ ...user, accs: '1' })
      expect(authAcc).toEqual({
        ips: data.ip,
        role: rest.role
      })
    })

    test('Should ', async () => {
      const sut: IAuthenticateUserRepository = new RedisAuthenticatedUserAccountsRepository()
      const data = mockAuthenticateData()
      data.role = 'other_role' as any
      data.accountId = 'other_account_id'
      data.accessToken = 'other_access_token'
      await sut.authenticate(data)
      const user = userAccount.user
      await sleep(200)
      expect(await RedisClient.hGetAll(`token:${data.accessToken}`)).toEqual({
        accountId: data.accountId,
        role: data.role,
        userId: user.id
      })
      const authUser = await RedisClient.hGetAll(`auth_usr:${user.id}`)
      const authAcc = await RedisClient.hGetAll(`auth_acc:${data.accountId}`)
      expect(authUser).toEqual({ ...user, accs: '2' })
      expect(authAcc).toEqual({
        ips: data.ip,
        role: data.role
      })
    })

    test('Should ', async () => {
      const sut: IAuthenticateUserRepository = new RedisAuthenticatedUserAccountsRepository()
      const data = mockAuthenticateData()
      const firstIp = data.ip
      data.ip = 'other_ip'
      data.accessToken = 'third_access_token'
      await sut.authenticate(data)
      const { user, ...rest } = userAccount
      await sleep(200)
      expect(await RedisClient.hGetAll(`token:${data.accessToken}`)).toEqual({
        ...rest,
        userId: user.id
      })
      const authUser = await RedisClient.hGetAll(`auth_usr:${user.id}`)
      const authAcc = await RedisClient.hGetAll(`auth_acc:${rest.accountId}`)
      expect(authUser).toEqual({ ...user, accs: '3' })
      expect(authAcc).toEqual({
        ips: `${firstIp};;;${data.ip}`,
        role: data.role
      })
    })
  })

  describe('loadOwnUser()', () => {
    test('Should ', async () => {
      const sut: ILoadOwnAuthenticatedUserRepository = new RedisAuthenticatedUserAccountsRepository()
      const data = mockLoadUserData()
      const account = await sut.loadOwnUser(data)
      expect(account).toEqual(userAccount)
    })

    test('Should ', async () => {
      const sut: ILoadOwnAuthenticatedUserRepository = new RedisAuthenticatedUserAccountsRepository()
      const data = mockLoadUserData()
      data.ip = 'ip_not_registered'
      const account = await sut.loadOwnUser(data)
      expect(account).toBeNull()
    })
  })

  describe('deleteAccessToken()', () => {
    test('Should ', async () => {
      const sut: IDeleteAccessTokenRepository & IAuthenticateUserRepository & ILoadOwnAuthenticatedUserRepository = new RedisAuthenticatedUserAccountsRepository()
      const { ip, accessToken, ...data } = mockLoadUserData()
      const result = await sut.deleteAccessToken({ ip, accessToken })
      expect(result).toBe(true)
      await sleep(200)
      const account = await sut.loadOwnUser({ ip, accessToken, ...data })
      expect(account).toBeNull()
      const hasAccessToken = await RedisClient.hGetAll(`token:${accessToken}`)
      expect(Object.keys(hasAccessToken).length).toBe(0)
      const authAcc = await RedisClient.hGetAll(`auth_acc:${data.accountId}`)
      expect(Object.keys(authAcc).length > 0 ? authAcc.ips.includes(ip) : false).toBe(false)
    })

    test('Should ', async () => {
      const sut: IDeleteAccessTokenRepository & IAuthenticateUserRepository = new RedisAuthenticatedUserAccountsRepository()
      const { ip, accessToken, ...data } = mockLoadUserData()
      let result = await sut.deleteAccessToken({ ip, accessToken })
      expect(result).toBe(false)
      result = await sut.deleteAccessToken({ ip: 'ip_not_registered', accessToken: 'other_access_token' })
      expect(result).toBe(false)
      result = await sut.deleteAccessToken({ ip, accessToken: 'other_access_token' })
      expect(result).toBe(true)
      await sleep(200)
      result = await sut.deleteAccessToken({ ip: 'other_ip', accessToken: 'third_access_token', ...data })
      expect(result).toBe(true)
    })
  })

  describe('refreshToken()', () => {
    test('Should ', async () => {
      const sut: IRefreshAccessTokenRepository & IAuthenticateUserRepository = new RedisAuthenticatedUserAccountsRepository()
      await sut.authenticate(mockAuthenticateData())
      const { ip, accessToken, ...data } = mockLoadUserData()
      const result = await sut.refreshToken({
        ip,
        oldAccessToken: accessToken,
        newAccessToken: 'new_access_token',
        ...data
      })
      expect(result).toBe(true)
      await sleep(200)
      const oldAccessToken = await RedisClient.hGetAll(`token:${accessToken}`)
      const newAccessToken = await RedisClient.hGetAll('token:new_access_token')
      expect(Object.keys(oldAccessToken).length === 0).toBe(true)
      expect(Object.keys(newAccessToken).length > 0).toBe(true)
    })

    test('Should ', async () => {
      const sut: IRefreshAccessTokenRepository & ILoadOwnAuthenticatedUserRepository = new RedisAuthenticatedUserAccountsRepository()
      const { ip, accessToken, ...data } = mockLoadUserData()
      let result = await sut.refreshToken({
        ip,
        oldAccessToken: accessToken,
        newAccessToken: 'other_new_access_token',
        ...data
      })
      expect(result).toBe(false)
      await sleep(200)
      const newAccessToken = await RedisClient.hGetAll('token:other_new_access_token')
      expect(Object.keys(newAccessToken).length === 0).toBe(true)

      const loadData = mockLoadUserData()
      let account = await sut.loadOwnUser(loadData)
      expect(account).toBeNull()

      loadData.accessToken = 'other_new_access_token'
      account = await sut.loadOwnUser(loadData)
      expect(account).toBeNull()

      result = await sut.refreshToken({
        ip: 'ip_not_registered',
        oldAccessToken: 'new_access_token',
        newAccessToken: 'other_new_access_token',
        ...data
      })
      expect(result).toBe(false)
    })
  })
})
