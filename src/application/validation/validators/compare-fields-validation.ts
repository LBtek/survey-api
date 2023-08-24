import { type Validation } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) { }

  validate (input: object): Error {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare)
    }
  }
}
