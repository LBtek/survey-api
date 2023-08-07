import bcrypt from 'bcrypt'
import { type Hasher, type HashComparer } from '@/application/data/protocols/criptography'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) { }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, valueToCompare: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, valueToCompare)
    return isValid
  }
}
