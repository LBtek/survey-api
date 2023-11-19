import { type AuthenticationRepository, type IAuthenticateUserRepository, type IDeleteAccessTokenRepository, type ILoadAuthenticatedUserRepository, type IRefreshAccessTokenRepository } from '@/application/data/protocols/repositories'
import { type AuthenticatedAccount } from '@/application/entities'

export class RedisAuthenticatedUserAccountsRepository implements ILoadAuthenticatedUserRepository, IAuthenticateUserRepository, IRefreshAccessTokenRepository, IDeleteAccessTokenRepository {
  async authenticate (data: AuthenticationRepository.AuthenticateUser.Params): Promise<void> {
    return null
  }

  async loadUser (data: AuthenticationRepository.LoadUser.Params): Promise<AuthenticatedAccount.UserAccount> {
    return null
  }

  async deleteAccessToken (data: AuthenticationRepository.DeleteAccessToken.Params): Promise<boolean> {
    return null
  }

  async refreshToken (data: AuthenticationRepository.RefreshAccessToken.Params): Promise<boolean> {
    return null
  }
}
