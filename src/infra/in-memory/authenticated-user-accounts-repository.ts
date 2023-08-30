import { type ILoadAuthenticatedUserRepository, type AuthenticationRepository, type IAuthenticateUserRepository } from '@/application/data/protocols/repositories'
import { type IP, type AuthenticatedAccount } from '@/application/entities'
import { type UserID } from '@/domain/entities'

type IPsMapper = Map<IP, Set<string>>
type AuthenticatedUserAccountsMapper = Map<UserID, { ips: IPsMapper, authenticatedUser: AuthenticatedAccount.UserAccount }>

const authenticatedUserAccounts: AuthenticatedUserAccountsMapper = new Map()

export class InMemoryAuthenticatedUserAccountsRepository implements ILoadAuthenticatedUserRepository, IAuthenticateUserRepository {
  async authenticate (data: AuthenticationRepository.AuthenticateUser.Params): Promise<AuthenticationRepository.AuthenticateUser.Result> {
    const { ip, accessToken, role, accountId, user } = data
    const authenticatedUserAccount = authenticatedUserAccounts.get(user.id)
    if (authenticatedUserAccount) {
      const userAccountKeysByIp = authenticatedUserAccount.ips.get(ip)
      if (userAccountKeysByIp) {
        userAccountKeysByIp.add(JSON.stringify({ accessToken, role }))
      } else {
        authenticatedUserAccount.ips.set(
          ip,
          new Set<string>().add(JSON.stringify({ accessToken, role }))
        )
      }
    } else {
      const userAccountKeys = new Set<string>()
      userAccountKeys.add(JSON.stringify({ accessToken, role }))
      const ips: IPsMapper = new Map()
      ips.set(ip, userAccountKeys)
      authenticatedUserAccounts.set(user.id, { ips, authenticatedUser: { accountId, user } })
    }
  }

  async loadUser (data: AuthenticationRepository.LoadUser.Params): Promise<AuthenticationRepository.LoadUser.Result> {
    const { ip, accessToken, role, userId } = data
    const authenticatedUserAccount = authenticatedUserAccounts.get(userId)
    if (authenticatedUserAccount) {
      const userAccountKeysByIp = authenticatedUserAccount.ips.get(ip)
      if (userAccountKeysByIp && userAccountKeysByIp.has(JSON.stringify({ accessToken, role }))) {
        return authenticatedUserAccount.authenticatedUser
      }
    }
    return null
  }
}
