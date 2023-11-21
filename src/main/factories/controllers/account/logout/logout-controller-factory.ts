import { type IController } from '@/presentation/protocols'
import { LogoutController } from '@/presentation/controllers/account'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/authenticated-user-accounts-repository'
import { makeLogoutValidation } from './logout-validation-factory'

export const makeLogoutController = (): IController => {
  const controller = new LogoutController(new InMemoryAuthenticatedUserAccountsRepository(), makeLogoutValidation())
  return makeLogControllerDecorator(controller)
}
