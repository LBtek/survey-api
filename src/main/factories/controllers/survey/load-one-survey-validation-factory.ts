import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { loadOneSurveyZodSchema } from '@/infra/validators/zod-schemas'

export const makeLoadOneSurveyValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new ZodValidation(loadOneSurveyZodSchema))
  return new ValidationComposite(validations)
}
