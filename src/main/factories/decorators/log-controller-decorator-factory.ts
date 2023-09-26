import { type IController } from '@/presentation/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb/log'
import { LogControllerDecorator } from '@/main/decorators'

export const makeLogControllerDecorator = (controller: IController): IController => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
