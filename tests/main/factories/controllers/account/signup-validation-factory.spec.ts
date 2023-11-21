import { type IValidation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  ValidationComposite,
  ZodValidation
} from '@/application/validation/validators'
import { makeSignUpValidation } from '@/main/factories/controllers'
import { signUpZodSchema } from '@/infra/validators/zod-schemas'

jest.mock('@/application/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: IValidation[] = []
    validations.push(new ZodValidation(signUpZodSchema))
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
