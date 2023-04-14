import { type LoadAccountByToken, type AccountModel, type TokenDecrypter } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly tokenDecrypter: TokenDecrypter) { }
  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    await this.tokenDecrypter.decrypt(accessToken)
    return null
  }
}
