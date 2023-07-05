import { type Controller } from '@/presentation/protocols'
import { SaveSurveyVoteController } from '@/presentation/controllers/survey-vote/save-survey-vote/save-survey-vote-controller'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'
import { makeDbSaveSurveyVote } from '@/main/factories/usecases/survey-vote/save-survey-vote/db-save-survey-vote-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeSaveSurveyVoteController = (): Controller => {
  const controller = new SaveSurveyVoteController(makeDbLoadSurveyById(), makeDbSaveSurveyVote())
  return makeLogControllerDecorator(controller)
}
