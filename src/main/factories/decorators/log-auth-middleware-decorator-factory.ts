import { type IMiddleware } from '@/presentation/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/log'
import { LogAuthMiddlewareDecorator } from '@/main/decorators'

export const makeLogAuthMiddlewareDecorator = (middleware: IMiddleware): IMiddleware => {
  const logMongoRepository = new LogMongoRepository()
  return new LogAuthMiddlewareDecorator(middleware, logMongoRepository)
}
