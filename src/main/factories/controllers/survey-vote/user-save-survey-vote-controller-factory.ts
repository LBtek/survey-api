import { type IController } from '@/presentation/protocols'
import { UserSaveSurveyVoteController } from '@/presentation/controllers'
import { makeUserSaveSurveyVoteUsecase } from '@/main/factories/usecases/survey-vote'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeCheckSurveyAnswerService } from '@/main/factories/services/app-services'
import { makeSaveSurveyVoteValidation } from './save-survey-vote-validation-factory'

export const makeUserSaveSurveyVoteController = (): IController => {
  const controller = new UserSaveSurveyVoteController(makeSaveSurveyVoteValidation(), makeCheckSurveyAnswerService(), makeUserSaveSurveyVoteUsecase())
  return makeLogControllerDecorator(controller)
}
