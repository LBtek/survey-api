import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { makeLoginValidation } from '@/main/factories/controllers'
import { loginZodSchema } from '@/infra/validators/zod-schemas'

jest.mock('@/application/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: IValidation[] = []
    validations.push(new ZodValidation(loginZodSchema))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
