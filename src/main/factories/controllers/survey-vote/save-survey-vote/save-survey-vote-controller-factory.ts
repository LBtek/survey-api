import { type Controller } from '@/presentation/protocols'
import { SaveSurveyVoteController } from '@/presentation/controllers/survey-vote/save-survey-vote/save-survey-vote-controller'
import { makeDbSaveSurveyVote } from '@/main/factories/usecases/survey-vote/save-survey-vote/db-save-survey-vote-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeSaveSurveyVoteController = (): Controller => {
  const controller = new SaveSurveyVoteController(new SurveyMongoRepository(), makeDbSaveSurveyVote())
  return makeLogControllerDecorator(controller)
}
