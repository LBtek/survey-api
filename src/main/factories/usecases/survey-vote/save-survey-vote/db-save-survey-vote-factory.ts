import { type SaveSurveyVote } from '@/domain/usecases/survey-vote/save-survey-vote'
import { SurveyVoteMongoRepository } from '@/infra/db/mongodb/survey-vote/survey-vote-mongo-repository'
import { DbSaveSurveyVote } from '@/data/usecases/survey-vote/save-survey-vote/db-save-survey-vote'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbSaveSurveyVote = (): SaveSurveyVote => {
  const surveyVoteMongoRepository = new SurveyVoteMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbSaveSurveyVote(surveyVoteMongoRepository, surveyMongoRepository)
}
