/* import { EmailValidatorSpy } from '../mocks'
import { EmailValidation } from '@/application/validation/validators'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    emailValidatorStub.res = false
    const error = sut.validate({ email: 'any_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    sut.validate({ email: 'any_email@mail.com' })
    expect(emailValidatorStub.email).toBe('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
 */
