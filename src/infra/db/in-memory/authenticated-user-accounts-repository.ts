/* istanbul ignore file */

import {
  type AuthenticationRepository,
  type IAuthenticateUserRepository,
  type ILoadOwnAuthenticatedUserRepository,
  type IDeleteAccessTokenRepository,
  type IRefreshAccessTokenRepository
} from '@/application/data/protocols/repositories'
import { type AccessToken, type AccountID, type AuthenticatedAccount } from '@/application/entities'
import { type UserID, type User } from '@/domain/entities'

type AccountsMapper = Map<AccountID, AuthenticatedAccount.BaseDataModel.Body>
export type UserAccountsMapper = Map<UserID, { accounts: AccountsMapper, user: User.Model }>

export const authenticatedUserAccounts: UserAccountsMapper = new Map()

export type TokenPayload = { userId: UserID, accountId: AccountID, role: AuthenticatedAccount.BaseDataModel.Body['role'] }

export const authenticatedTokens = new Map<AccessToken, TokenPayload>()

type IPsMapper = AuthenticatedAccount.BaseDataModel.Body['ips']

export class InMemoryAuthenticatedUserAccountsRepository implements ILoadOwnAuthenticatedUserRepository, IAuthenticateUserRepository, IRefreshAccessTokenRepository, IDeleteAccessTokenRepository {
  async authenticate (
    data: AuthenticationRepository.AuthenticateUser.Params
  ): Promise<AuthenticationRepository.AuthenticateUser.Result> {
    const { ip, accessToken, role, accountId, user } = data
    const userAccountTokens = new Set<AccessToken>()
    userAccountTokens.add(accessToken)
    const ips: IPsMapper = new Map()
    ips.set(ip, userAccountTokens)
    const accounts: AccountsMapper = new Map()
    accounts.set(accountId, { ips, role })

    authenticatedTokens.set(accessToken, { userId: user.id, accountId, role })

    const authenticatedUser = authenticatedUserAccounts.get(user.id)
    if (!authenticatedUser) {
      authenticatedUserAccounts.set(user.id, { accounts, user })
    } else {
      const authenticatedUserAccount = authenticatedUser.accounts.get(accountId)
      if (!authenticatedUserAccount) {
        authenticatedUser.accounts.set(accountId, { ips, role })
      } else {
        const userAccountTokensByIp = authenticatedUserAccount.ips.get(ip)
        if (!userAccountTokensByIp) {
          authenticatedUserAccount.ips.set(ip, userAccountTokens)
        } else {
          userAccountTokensByIp.add(accessToken)
        }
      }
    }
  }

  async loadOwnUser (data: AuthenticationRepository.LoadOwnUser.Params): Promise<AuthenticationRepository.LoadOwnUser.Result> {
    const { ip, accessToken, role, userId, accountId } = data
    const authenticatedUser = authenticatedUserAccounts.get(userId)
    const authenticatedUserAccount = authenticatedUser?.accounts.get(accountId)
    const userAccountTokensByIp = authenticatedUserAccount?.ips.get(ip)
    if (
      userAccountTokensByIp &&
      role === authenticatedUserAccount.role &&
      userAccountTokensByIp.has(accessToken)
    ) {
      return {
        accountId,
        role,
        user: authenticatedUser.user
      }
    }
    return null
  }

  async deleteAccessToken (
    data: AuthenticationRepository.DeleteAccessToken.Params
  ): Promise<AuthenticationRepository.DeleteAccessToken.Result> {
    const { ip, accessToken } = data
    let payload: TokenPayload
    if (!data.userId || !data.accountId || !data.role) {
      payload = authenticatedTokens.get(accessToken)
    }
    const userId = data.userId || payload?.userId
    const accountId = data.accountId || payload?.accountId
    const role = data.role || payload?.role

    const authenticatedUserAccount = authenticatedUserAccounts.get(userId)?.accounts.get(accountId)
    const userAccountTokensByIp = authenticatedUserAccount?.ips.get(ip)
    if (
      userAccountTokensByIp &&
      role === authenticatedUserAccount.role &&
      userAccountTokensByIp.has(accessToken)
    ) {
      userAccountTokensByIp.delete(accessToken)
      authenticatedTokens.delete(accessToken)
      return true
    }
    return false
  }

  async refreshToken (
    data: AuthenticationRepository.RefreshAccessToken.Params
  ): Promise<AuthenticationRepository.RefreshAccessToken.Result> {
    const { ip, oldAccessToken: accessToken, role, userId, newAccessToken, accountId } = data

    const wasRemoved = await this.deleteAccessToken({ ip, accessToken, userId, accountId, role })

    if (wasRemoved) {
      authenticatedUserAccounts
        .get(userId).accounts
        .get(accountId).ips
        .get(ip).add(newAccessToken)

      authenticatedTokens.set(newAccessToken, { userId, accountId, role })

      return true
    }

    return false
  }
}
