import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { userLoadOneSurveyZodSchema } from '@/infra/validators/zod-schemas'

export const makeUserLoadOneSurveyValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new ZodValidation(userLoadOneSurveyZodSchema))
  return new ValidationComposite(validations)
}
