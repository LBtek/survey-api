import { type IValidation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite, AnswersValidation } from '@/application/validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new AnswersValidation())
  return new ValidationComposite(validations)
}
