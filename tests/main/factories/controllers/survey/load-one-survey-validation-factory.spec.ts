import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { makeLoadOneSurveyValidation } from '@/main/factories/controllers'
import { loadOneSurveyZodSchema } from '@/infra/validators/zod-schemas'

jest.mock('@/application/validation/validators/validation-composite')

describe('LoadOneSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoadOneSurveyValidation()
    const validations: IValidation[] = []
    validations.push(new ZodValidation(loadOneSurveyZodSchema))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
