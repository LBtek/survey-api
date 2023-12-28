import { type IUserSaveSurveyVote } from '@/domain/usecases/user-context'
import { UserSurveyVoteMongoRepository } from '@/infra/db/mongodb/user-survey-vote-mongo-repository'
import { UserSaveSurveyVote } from '@/application/data/usecases/survey-vote'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeUserSaveSurveyVoteUsecase = (): IUserSaveSurveyVote => {
  const userSurveyVoteMongoRepository = new UserSurveyVoteMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new UserSaveSurveyVote(userSurveyVoteMongoRepository, surveyMongoRepository)
}
