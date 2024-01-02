import { type IController } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeGuestLoadOneSurveyUsecase } from '@/main/factories/usecases/survey'
import { GuestLoadOneSurveyController } from '@/presentation/controllers'
import { makeLoadOneSurveyValidation } from './load-one-survey-validation-factory'

export const makeGuestLoadOneSurveyController = (): IController => {
  const controller = new GuestLoadOneSurveyController(makeGuestLoadOneSurveyUsecase(), makeLoadOneSurveyValidation())
  return makeLogControllerDecorator(controller)
}
