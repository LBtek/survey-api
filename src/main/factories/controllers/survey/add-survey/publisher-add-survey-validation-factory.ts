import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { addSurveyZodSchema } from '@/infra/validators/zod-schemas'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new ZodValidation(addSurveyZodSchema))
  return new ValidationComposite(validations)
}
