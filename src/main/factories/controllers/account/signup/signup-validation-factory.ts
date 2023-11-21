import { type IValidation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  ValidationComposite,
  ZodValidation
} from '@/application/validation/validators'
import { signUpZodSchema } from '@/infra/validators/zod-schemas'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new ZodValidation(signUpZodSchema))
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}
