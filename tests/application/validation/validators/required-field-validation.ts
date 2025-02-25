/* import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/application/validation/validators'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    let error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
    error = sut.validate({ field: true })
    expect(error).toBeFalsy()
    error = sut.validate({ field: false })
    expect(error).toBeFalsy()
  })
})
 */
