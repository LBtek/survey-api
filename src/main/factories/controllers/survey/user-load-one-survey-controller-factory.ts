import { type IController } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeUserLoadOneSurveyUsecase } from '@/main/factories/usecases/survey'
import { UserLoadOneSurveyController } from '@/presentation/controllers'
import { makeLoadOneSurveyValidation } from './load-one-survey-validation-factory'

export const makeUserLoadOneSurveyController = (): IController => {
  const controller = new UserLoadOneSurveyController(makeUserLoadOneSurveyUsecase(), makeLoadOneSurveyValidation())
  return makeLogControllerDecorator(controller)
}
