import { type IController } from '@/presentation/protocols'
import { LogoutController } from '@/presentation/controllers/account'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/in-memory/authenticated-user-accounts-repository'

export const makeLogoutController = (): IController => {
  const controller = new LogoutController(new InMemoryAuthenticatedUserAccountsRepository())
  return makeLogControllerDecorator(controller)
}
