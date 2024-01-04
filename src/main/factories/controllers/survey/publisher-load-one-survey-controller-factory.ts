import { type IController } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makePublisherLoadOneSurveyUsecase } from '@/main/factories/usecases/survey'
import { PublisherLoadOneSurveyController } from '@/presentation/controllers'
import { makeLoadOneSurveyValidation } from './load-one-survey-validation-factory'

export const makePublisherLoadOneSurveyController = (): IController => {
  const controller = new PublisherLoadOneSurveyController(makePublisherLoadOneSurveyUsecase(), makeLoadOneSurveyValidation())
  return makeLogControllerDecorator(controller)
}
