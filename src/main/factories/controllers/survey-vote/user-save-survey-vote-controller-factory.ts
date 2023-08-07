import { type Controller } from '@/presentation/protocols'
import { UserSaveSurveyVoteController } from '@/presentation/controllers'
import { makeDbUserSaveSurveyVote } from '@/main/factories/usecases/survey-vote'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeCheckSurveyAnswerService } from '../../services/app-services'

export const makeUserSaveSurveyVoteController = (): Controller => {
  const controller = new UserSaveSurveyVoteController(makeCheckSurveyAnswerService(), makeDbUserSaveSurveyVote())
  return makeLogControllerDecorator(controller)
}
