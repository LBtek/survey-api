import { type IValidation } from '@/presentation/protocols'
import { type IEmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors'

export class EmailValidation implements IValidation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator
  ) { }

  validate (input: object): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
