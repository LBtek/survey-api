import { type Account } from '@/domain/entities'
import { type Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { makeLogAuthMiddlewareDecorator } from '../decorators'
import { makeDbLoadUserByAccountAccessToken } from '../services/app-services'

export const makeAuthMiddleware = (role?: Account.BaseDataModel.Roles): Middleware => {
  const middleware = new AuthMiddleware(makeDbLoadUserByAccountAccessToken(), role)
  return makeLogAuthMiddlewareDecorator(middleware)
}
