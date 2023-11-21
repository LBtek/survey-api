/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* istanbul ignore file */

import { type IValidation } from '@/presentation/protocols'
import { type AnyZodObject } from 'zod'

export class ZodValidation implements IValidation {
  constructor (private readonly zodValidatorSchema: AnyZodObject) { }

  validate (input: object): Error {
    const result = this.zodValidatorSchema.safeParse(input)
    if (result.success === false) {
      return result.error
    }
    return null
  }
}
