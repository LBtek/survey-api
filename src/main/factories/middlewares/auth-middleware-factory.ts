import { type Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory'
import { makeLogAuthMiddlewareDecorator } from '../decorators/log-auth-middleware-decorator-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const middleware = new AuthMiddleware(makeDbLoadAccountByToken(), role)
  return makeLogAuthMiddlewareDecorator(middleware)
}
