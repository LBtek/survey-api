import { type Account } from '@/application/entities'
import { type Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { makeLogAuthMiddlewareDecorator } from '../decorators'
import { makeExtractAccessTokenPayloadService, makeLoadAuthenticatedUserByTokenService } from '../services/app-services'
import { makeCheckAndRefreshTokenService } from '../services/app-services/check-and-refresh-access-token-factory'

export const makeAuthMiddleware = (roles?: Set<Account.BaseDataModel.Roles>): Middleware => {
  const middleware = new AuthMiddleware(makeExtractAccessTokenPayloadService(), makeLoadAuthenticatedUserByTokenService(), makeCheckAndRefreshTokenService(), roles)
  return makeLogAuthMiddlewareDecorator(middleware)
}
