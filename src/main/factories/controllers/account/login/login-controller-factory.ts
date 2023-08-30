import { type Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/account/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { makeAuthenticationService } from '@/main/factories/services/app-services'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeAuthenticationService(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
