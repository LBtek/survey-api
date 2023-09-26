import { type IController } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers/account/signup-controller'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeAddAccountUsecase } from '@/main/factories/usecases/account'
import { makeAuthenticationService } from '@/main/factories/services/app-services'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export const makeSignUpController = (): IController => {
  const controller = new SignUpController(makeAddAccountUsecase(), makeSignUpValidation(), makeAuthenticationService())
  return makeLogControllerDecorator(controller)
}
