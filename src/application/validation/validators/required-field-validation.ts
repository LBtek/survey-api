/* istanbul ignore file */

import { type IValidation } from '@/presentation/protocols'
import { MissingParamError } from '@/presentation/errors'

/**
 * @deprecated
 * This class is not used anymore
 *
 * Now the zod library is used for this type of validation.
 */
export class RequiredFieldValidation implements IValidation {
  constructor (private readonly fieldName: string) { }

  validate (input: object): Error {
    if (typeof input[this.fieldName] !== 'boolean' && !input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
