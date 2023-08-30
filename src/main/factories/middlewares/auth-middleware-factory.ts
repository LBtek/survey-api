import { type Account } from '@/application/entities'
import { type Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { makeLogAuthMiddlewareDecorator } from '../decorators'
import { makeDbLoadUserByAccountAccessToken } from '../services/app-services'

export const makeAuthMiddleware = (roles?: Set<Account.BaseDataModel.Roles>): Middleware => {
  const middleware = new AuthMiddleware(makeDbLoadUserByAccountAccessToken(), roles)
  return makeLogAuthMiddlewareDecorator(middleware)
}
