import { type Validation } from '@/presentation/protocols'

export class ValidationSpy implements Validation {
  input: object
  res = null

  validate (input: object): Error | null {
    this.input = input
    return this.res
  }
}
