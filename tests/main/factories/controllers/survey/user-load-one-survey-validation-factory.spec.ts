import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { makeUserLoadOneSurveyValidation } from '@/main/factories/controllers'
import { userLoadOneSurveyZodSchema } from '@/infra/validators/zod-schemas'

jest.mock('@/application/validation/validators/validation-composite')

describe('UserLoadOneSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeUserLoadOneSurveyValidation()
    const validations: IValidation[] = []
    validations.push(new ZodValidation(userLoadOneSurveyZodSchema))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
