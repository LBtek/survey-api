import { type Middleware } from '@/presentation/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LogAuthMiddlewareDecorator } from '@/main/decorators/log-auth-middleware-decorator'

export const makeLogAuthMiddlewareDecorator = (middleware: Middleware): Middleware => {
  const logMongoRepository = new LogMongoRepository()
  return new LogAuthMiddlewareDecorator(middleware, logMongoRepository)
}
