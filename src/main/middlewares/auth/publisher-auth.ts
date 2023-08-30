import { type Account } from '@/application/entities'
import { adaptMiddleware } from '../../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../../factories/middlewares/auth-middleware-factory'

export const authPublisher = adaptMiddleware(makeAuthMiddleware(new Set<Account.BaseDataModel.Roles>().add('publisher')))
