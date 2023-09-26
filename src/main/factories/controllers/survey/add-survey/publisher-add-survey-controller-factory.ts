import { type IController } from '@/presentation/protocols'
import { PublisherAddSurveyController } from '@/presentation/controllers'
import { makePublisherAddSurveyUsecase } from '@/main/factories/usecases/survey'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeAddSurveyValidation } from './publisher-add-survey-validation-factory'

export const makePublisherAddSurveyController = (): IController => {
  const controller = new PublisherAddSurveyController(makeAddSurveyValidation(), makePublisherAddSurveyUsecase())
  return makeLogControllerDecorator(controller)
}
