import { type LoadAccountByToken, type AccountModel, type TokenDecrypter, type LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly tokenDecrypter: TokenDecrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const payload = await this.tokenDecrypter.decrypt(accessToken)
    if (payload) {
      await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    }
    return null
  }
}
