import { type Controller } from '@/presentation/protocols'
import { PublisherAddSurveyController } from '@/presentation/controllers'
import { makeDbPublisherAddSurvey } from '@/main/factories/usecases/survey'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeAddSurveyValidation } from './publisher-add-survey-validation-factory'

export const makePublisherAddSurveyController = (): Controller => {
  const controller = new PublisherAddSurveyController(makeAddSurveyValidation(), makeDbPublisherAddSurvey())
  return makeLogControllerDecorator(controller)
}
