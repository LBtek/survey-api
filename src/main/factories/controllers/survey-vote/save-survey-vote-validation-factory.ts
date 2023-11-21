import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { saveSurveyVoteZodValidation } from '@/infra/validators/zod-schemas'

export const makeSaveSurveyVoteValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  validations.push(new ZodValidation(saveSurveyVoteZodValidation))
  return new ValidationComposite(validations)
}
