import { type IController } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/account'
import { makeLoginValidation } from './login-validation-factory'
import { makeAuthenticationService } from '@/main/factories/services/app-services'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export const makeLoginController = (): IController => {
  const controller = new LoginController(makeAuthenticationService(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
