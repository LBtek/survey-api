import { type Controller } from '@/presentation/protocols'
import { UserLoadAllSurveysController } from '@/presentation/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbUserLoadAllSurveys } from '@/main/factories/usecases/survey'

export const makeUserLoadAllSurveysController = (): Controller => {
  const controller = new UserLoadAllSurveysController(makeDbUserLoadAllSurveys())
  return makeLogControllerDecorator(controller)
}
