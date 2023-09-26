import { type IController } from '@/presentation/protocols'
import { SaveSurveyVoteController } from '@/presentation/controllers'
import { makeSaveSurveyVoteUsecase } from '@/main/factories/usecases/survey-vote'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeCheckSurveyAnswerService } from '../../services/app-services'

export const makeSaveSurveyVoteController = (): IController => {
  const controller = new SaveSurveyVoteController(makeCheckSurveyAnswerService(), makeSaveSurveyVoteUsecase())
  return makeLogControllerDecorator(controller)
}
