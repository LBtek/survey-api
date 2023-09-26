import { type IHashComparer, type ITokenGenerator, type IHasher, type ITokenDecrypter } from '@/application/data/protocols/criptography'

export class HasherSpy implements IHasher {
  hashed = 'hash'
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.hashed
  }
}

export class HashComparerSpy implements IHashComparer {
  plaintext: string
  hash: string
  isValid = true

  async compare (plaintext: string, hash: string): Promise<boolean> {
    this.plaintext = plaintext
    this.hash = hash
    return this.isValid
  }
}

export class TokenGeneratorSpy implements ITokenGenerator {
  token = 'any_token'
  content: any

  async generate (payload: object): Promise<string> {
    this.content = payload
    return this.token
  }
}

export class TokenDecrypterSpy implements ITokenDecrypter {
  token: string
  decrypted: any = {
    accountId: 'any_account_id',
    userId: 'any_user_id',
    role: 'any_role',
    willExpireIn: Date.now() / 1000
  }

  async decrypt (token: string): Promise<object> {
    this.token = token
    return this.decrypted
  }
}
