import { type SaveSurveyVote } from '@/domain/usecases/user-context'
import { SurveyVoteMongoRepository } from '@/infra/db/mongodb/survey-vote-mongo-repository'
import { DbSaveSurveyVote } from '@/application/data/usecases/survey-vote'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeDbSaveSurveyVote = (): SaveSurveyVote => {
  const surveyVoteMongoRepository = new SurveyVoteMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbSaveSurveyVote(surveyVoteMongoRepository, surveyMongoRepository)
}
