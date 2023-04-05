import { type Validation } from '@/presentation/protocols'
import { type EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) { }

  validate (input: object): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
