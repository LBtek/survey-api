import { type Controller } from '@/presentation/protocols'
import { SaveSurveyVoteController } from '@/presentation/controllers'
import { makeDbSaveSurveyVote } from '@/main/factories/usecases/survey-vote'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeCheckSurveyAnswerService } from '../../services/app-services'

export const makeSaveSurveyVoteController = (): Controller => {
  const controller = new SaveSurveyVoteController(makeCheckSurveyAnswerService(), makeDbSaveSurveyVote())
  return makeLogControllerDecorator(controller)
}
