import { type IValidation } from '@/presentation/protocols'
import { MissingParamError } from '@/presentation/errors'

export class RequiredFieldValidation implements IValidation {
  constructor (private readonly fieldName: string) { }

  validate (input: object): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
