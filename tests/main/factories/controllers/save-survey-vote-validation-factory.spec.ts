import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { makeSaveSurveyVoteValidation } from '@/main/factories/controllers'
import { saveSurveyVoteZodValidation } from '@/infra/validators/zod-schemas'

jest.mock('@/application/validation/validators/validation-composite')

describe('SaveSurveyVoteValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSaveSurveyVoteValidation()
    const validations: IValidation[] = []
    validations.push(new ZodValidation(saveSurveyVoteZodValidation))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
