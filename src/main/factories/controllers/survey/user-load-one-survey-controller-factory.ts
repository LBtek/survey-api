import { type Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbUserLoadOneSurvey } from '@/main/factories/usecases/survey'
import { UserLoadOneSurveyController } from '@/presentation/controllers'

export const makeUserLoadOneSurveyController = (): Controller => {
  const controller = new UserLoadOneSurveyController(makeDbUserLoadOneSurvey())
  return makeLogControllerDecorator(controller)
}
