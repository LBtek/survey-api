import { type Middleware } from '@/presentation/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/log'
import { LogAuthMiddlewareDecorator } from '@/main/decorators'

export const makeLogAuthMiddlewareDecorator = (middleware: Middleware): Middleware => {
  const logMongoRepository = new LogMongoRepository()
  return new LogAuthMiddlewareDecorator(middleware, logMongoRepository)
}
