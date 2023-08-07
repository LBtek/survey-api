import { type UserSaveSurveyVote } from '@/domain/usecases/user-context'
import { SurveyVoteMongoRepository } from '@/infra/db/mongodb/survey-vote-mongo-repository'
import { DbUserSaveSurveyVote } from '@/application/data/usecases/survey-vote'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeDbUserSaveSurveyVote = (): UserSaveSurveyVote => {
  const surveyVoteMongoRepository = new SurveyVoteMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbUserSaveSurveyVote(surveyVoteMongoRepository, surveyMongoRepository)
}
