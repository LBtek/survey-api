import { type IController } from '@/presentation/protocols'
import { SaveSurveyVoteController } from '@/presentation/controllers'
import { makeSaveSurveyVoteUsecase } from '@/main/factories/usecases/survey-vote'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeCheckSurveyAnswerService } from '@/main/factories/services/app-services'
import { makeSaveSurveyVoteValidation } from './save-survey-vote-validation-factory'

export const makeSaveSurveyVoteController = (): IController => {
  const controller = new SaveSurveyVoteController(makeSaveSurveyVoteValidation(), makeCheckSurveyAnswerService(), makeSaveSurveyVoteUsecase())
  return makeLogControllerDecorator(controller)
}
