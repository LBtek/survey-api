import jwt from 'jsonwebtoken'
import { type TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { type TokenDecrypter } from '@/data/protocols/criptography/token-decrypter'

export class JwtAdapter implements TokenGenerator, TokenDecrypter {
  constructor (private readonly secret: string) { }

  async generate (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (token: string): Promise<any> {
    const value = jwt.verify(token, this.secret)
    return value
  }
}
