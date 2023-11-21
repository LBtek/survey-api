import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { logoutZodSchema } from '@/infra/validators/zod-schemas'

export const makeLogoutValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new ZodValidation(logoutZodSchema))
  return new ValidationComposite(validations)
}
