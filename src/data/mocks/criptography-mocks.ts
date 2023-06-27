import { type Hasher } from '../protocols/criptography/hasher'
import { type HashComparer } from '../protocols/criptography/hash-comparer'
import { type TokenGenerator } from '../protocols/criptography/token-generator'
import { type TokenDecrypter } from '../protocols/criptography/token-decrypter'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('any_password')
    }
  }
  return new HasherStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, valueToCompare: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

export const mockTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new TokenGeneratorStub()
}

export const mockTokenDecrypter = (): TokenDecrypter => {
  class TokenDecrypterStub implements TokenDecrypter {
    async decrypt (token: string): Promise<string> {
      return 'any_value'
    }
  }
  return new TokenDecrypterStub()
}
