import jwt from 'jsonwebtoken'
import { type TokenDecrypter, type TokenGenerator } from '@/application/data/protocols/criptography'

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
