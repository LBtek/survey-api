import { type IValidation } from '@/presentation/protocols'

export class ValidationSpy implements IValidation {
  input: object
  res = null

  validate (input: object): Error | null {
    this.input = input
    return this.res
  }
}
