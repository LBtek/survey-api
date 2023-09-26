import { type ISaveSurveyVote } from '@/domain/usecases/user-context'
import { SurveyVoteMongoRepository } from '@/infra/db/mongodb/survey-vote-mongo-repository'
import { SaveSurveyVote } from '@/application/data/usecases/survey-vote'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeSaveSurveyVoteUsecase = (): ISaveSurveyVote => {
  const surveyVoteMongoRepository = new SurveyVoteMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new SaveSurveyVote(surveyVoteMongoRepository, surveyMongoRepository)
}
