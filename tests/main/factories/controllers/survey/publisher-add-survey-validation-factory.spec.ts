import { type Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite, AnswersValidation } from '@/application/validation/validators'
import { makeAddSurveyValidation } from '@/main/factories/controllers'

jest.mock('@/application/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new AnswersValidation())
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
