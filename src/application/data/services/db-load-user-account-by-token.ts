import { type Authentication } from '@/application/models'
import { type LoadUserAccountByTokenService } from '@/presentation/protocols/services'
import { type LoadUserAccountByTokenRepository } from '@/application/data/protocols/repositories'
import { type TokenDecrypter } from '@/application/data/protocols/criptography'

export class DbLoadUserByAccountAccessToken implements LoadUserAccountByTokenService {
  constructor (
    private readonly tokenDecrypter: TokenDecrypter,
    private readonly loadUserAccountByTokenRepository: LoadUserAccountByTokenRepository
  ) { }

  async loadByToken (data: Authentication.LoadUserByToken.Params): Promise<Authentication.LoadUserByToken.Result> {
    const payload = await this.tokenDecrypter.decrypt(data.accessToken)
    if (payload) {
      const account = await this.loadUserAccountByTokenRepository.loadByToken(data)
      if (account) {
        return account
      }
    }
    return null
  }
}
