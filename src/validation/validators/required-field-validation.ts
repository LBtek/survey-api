import { MissingParamError } from '../../presentation/errors'
import { type Validation } from '../../presentation/protocols'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) { }

  validate (input: object): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
