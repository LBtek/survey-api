import { type IValidation } from '@/presentation/protocols'
import { ValidationComposite, ZodValidation } from '@/application/validation/validators'
import { makeLogoutValidation } from '@/main/factories/controllers'
import { logoutZodSchema } from '@/infra/validators/zod-schemas'

jest.mock('@/application/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLogoutValidation()
    const validations: IValidation[] = []
    validations.push(new ZodValidation(logoutZodSchema))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
