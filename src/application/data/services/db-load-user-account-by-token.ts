import { type TokenDecrypter } from '@/application/data/protocols/criptography'
import { type LoadUserAccountByTokenRepository } from '@/application/data/protocols/repositories'
import {
  type LoadUserAccountByTokenService,
  type LoadUserAccountByTokenParams,
  type LoadUserAccountByTokenResult
} from '@/presentation/protocols/services'

export class DbLoadUserByAccountAccessToken implements LoadUserAccountByTokenService {
  constructor (
    private readonly tokenDecrypter: TokenDecrypter,
    private readonly loadUserAccountByTokenRepository: LoadUserAccountByTokenRepository
  ) { }

  async loadByToken (data: LoadUserAccountByTokenParams): Promise<LoadUserAccountByTokenResult> {
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
