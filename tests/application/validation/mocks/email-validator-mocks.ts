import { type IEmailValidator } from '@/application/validation/protocols/email-validator'

export class EmailValidatorSpy implements IEmailValidator {
  email: string
  res = true

  isValid (email: string): boolean {
    this.email = email
    return this.res
  }
}

export class EmailValidatorStub implements IEmailValidator {
  isValid (): boolean {
    return true
  }
}
