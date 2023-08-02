import { type Controller } from '@/presentation/protocols'
import { LoadSurveyController } from '@/presentation/controllers/survey/load-survey/load-survey-controller'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurvey } from '@/main/factories/usecases/survey/load-survey/db-load-survey-factory'

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveyController(makeDbLoadSurvey())
  return makeLogControllerDecorator(controller)
}
