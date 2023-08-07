import { type EmailValidator } from '@/application/validation/protocols/email-validator'

export class EmailValidatorSpy implements EmailValidator {
  email: string
  res = true

  isValid (email: string): boolean {
    this.email = email
    return this.res
  }
}

export class EmailValidatorStub implements EmailValidator {
  isValid (): boolean {
    return true
  }
}
