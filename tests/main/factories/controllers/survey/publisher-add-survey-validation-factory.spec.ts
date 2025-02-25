import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { makeAddSurveyValidation } from '@/main/factories/controllers'
import { addSurveyZodSchema } from '@/infra/validators/zod-schemas'

jest.mock('@/application/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: IValidation[] = []
    validations.push(new ZodValidation(addSurveyZodSchema))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
