import { type IController } from '@/presentation/protocols'
import { LogoutController } from '@/presentation/controllers/account'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { RedisAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/redis'
import { makeLogoutValidation } from './logout-validation-factory'

export const makeLogoutController = (): IController => {
  const controller = new LogoutController(new RedisAuthenticatedUserAccountsRepository(), makeLogoutValidation())
  return makeLogControllerDecorator(controller)
}
