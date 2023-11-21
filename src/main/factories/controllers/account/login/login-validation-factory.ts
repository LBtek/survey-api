import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { loginZodSchema } from '@/infra/validators/zod-schemas'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new ZodValidation(loginZodSchema))
  return new ValidationComposite(validations)
}
