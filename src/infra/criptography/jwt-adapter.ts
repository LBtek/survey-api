import { type ITokenDecrypter, type ITokenGenerator } from '@/application/data/protocols/criptography'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements ITokenGenerator, ITokenDecrypter {
  constructor (private readonly secret: string) { }

  async generate (payload: object): Promise<string> {
    const { exp, ...restPayload } = payload as any
    const accessToken = jwt.sign({
      ...restPayload,
      willExpireIn: Math.ceil(Date.now() / 1000) + (60 * 60)
    },
    this.secret,
    {
      expiresIn: 60 * 60 * 3
    }
    )
    return accessToken
  }

  async decrypt (token: string): Promise<any> {
    const payload = jwt.verify(token, this.secret)
    return payload
  }
}
