import jwt from 'jsonwebtoken'
import { type TokenGenerator } from '@/data/protocols/criptography/token-generator'

export class JwtAdapter implements TokenGenerator {
  constructor (private readonly secret: string) { }

  async generate (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }
}
