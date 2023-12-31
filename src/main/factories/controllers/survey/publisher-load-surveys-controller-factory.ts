import { type IController } from '@/presentation/protocols'
import { PublisherLoadSurveysController } from '@/presentation/controllers/survey'
import { makePublisherLoadSurveysUsecase } from '@/main/factories/usecases/survey'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export const makePublisherLoadSurveysController = (): IController => {
  const controller = new PublisherLoadSurveysController(makePublisherLoadSurveysUsecase())
  return makeLogControllerDecorator(controller)
}
