/* eslint-disable @typescript-eslint/no-floating-promises */
import { type AuthenticationRepository, type IAuthenticateUserRepository, type IDeleteAccessTokenRepository, type ILoadOwnAuthenticatedUserRepository, type IRefreshAccessTokenRepository } from '@/application/data/protocols/repositories'
import { type AuthenticatedAccount } from '@/application/entities'
import { RedisClient } from './RedisClient'
import { type TokenPayload } from '../authenticated-user-accounts-repository'

export class RedisAuthenticatedUserAccountsRepository implements ILoadOwnAuthenticatedUserRepository, IAuthenticateUserRepository, IRefreshAccessTokenRepository, IDeleteAccessTokenRepository {
  async authenticate (data: AuthenticationRepository.AuthenticateUser.Params): Promise<void> {
    const { ip, accessToken, role, accountId, user } = data
    const usr = await RedisClient.hGetAll(`auth_usr:${user.id}`)
    if (!usr) RedisClient.hSet(`auth_usr:${user.id}`, { ...user, accs: 1 })
    else {
      RedisClient.hIncrBy(`auth_usr:${user.id}`, 'accs', 1)
    }
    const authAcc = await RedisClient.hGetAll(`auth_acc:${accountId}`)
    if (!authAcc) {
      RedisClient.hSet(`auth_acc:${accountId}`, {
        ips: ip,
        role
      })
    } else {
      authAcc.ips += `;;;${ip}`
      RedisClient.hSet(`auth_acc:${accountId}`, authAcc)
    }
    RedisClient.hSet(`token:${accessToken}`, {
      userId: user.id,
      accountId,
      role
    })
  }

  async loadOwnUser (data: AuthenticationRepository.LoadOwnUser.Params): Promise<AuthenticatedAccount.UserAccount> {
    const { ip, accessToken, role, userId, accountId } = data
    const auth = await Promise.all([
      RedisClient.hGetAll(`auth_usr:${userId}`),
      RedisClient.hGetAll(`auth_acc:${accountId}`),
      RedisClient.hGetAll(`token:${accessToken}`)
    ])
    if (auth.length < 3) return null

    if (
      auth[1].role === role &&
      auth[1].ips.includes(ip)
    ) {
      return {
        accountId,
        role,
        user: auth[0] as AuthenticatedAccount.UserAccount['user']
      }
    }
    return null
  }

  async deleteAccessToken (data: AuthenticationRepository.DeleteAccessToken.Params): Promise<boolean> {
    const { ip, accessToken } = data
    let payload: TokenPayload
    if (!data.userId || !data.accountId || !data.role) {
      payload = await RedisClient.hGetAll(`token:${accessToken}`) as TokenPayload
    }
    const userId = data.userId || payload?.userId
    const accountId = data.accountId || payload?.accountId
    const role = data.role || payload?.role

    const auth = await Promise.all([
      RedisClient.hGetAll(`auth_usr:${userId}`),
      RedisClient.hGetAll(`auth_acc:${accountId}`)
    ])
    if (auth.length < 2) return false

    if (
      auth[1].role === role &&
      auth[1].ips.includes(ip)
    ) {
      RedisClient.del(`token:${accessToken}`)
      auth[1].ips = auth[1].ips.replace(`${ip};;;`, '').replace(`;;;${ip}`, '').replace(ip, '')

      if (!auth[1].ips.length) {
        RedisClient.del(`auth_acc:${accountId}`)
      } else {
        RedisClient.hSet(`auth_acc:${accountId}`, {
          ips: auth[1].ips,
          role
        })
      }

      if (Number(auth[0].accs) <= 1) {
        RedisClient.del(`auth_usr:${userId}`)
      } else {
        RedisClient.hIncrBy(`auth_usr:${userId}`, 'accs', -1)
      }
      return true
    }
    return false
  }

  async refreshToken (data: AuthenticationRepository.RefreshAccessToken.Params): Promise<boolean> {
    const { ip, oldAccessToken: accessToken, role, userId, newAccessToken, accountId } = data

    const auth = await Promise.all([
      RedisClient.hGetAll(`token:${accessToken}`),
      RedisClient.hGetAll(`auth_acc:${accountId}`),
      RedisClient.hGetAll(`auth_usr:${userId}`)
    ])
    if (auth.length < 3) return false

    if (
      auth[1].role === role &&
      auth[1].ips.includes(ip)
    ) {
      RedisClient.del(`token:${accessToken}`)
      RedisClient.hSet(`token:${newAccessToken}`, {
        userId,
        accountId,
        role
      })
      return true
    }

    return false
  }
}
