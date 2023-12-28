import { type IGuestSaveSurveyVote } from '@/domain/usecases/guest-context'
import { GuestSurveyVoteMongoRepository } from '@/infra/db/mongodb/guest-survey-vote-mongo-repository'
import { GuestSaveSurveyVote } from '@/application/data/usecases/survey-vote/guest-save-survey-vote'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeGuestSaveSurveyVoteUsecase = (): IGuestSaveSurveyVote => {
  const guestSurveyVoteMongoRepository = new GuestSurveyVoteMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new GuestSaveSurveyVote(guestSurveyVoteMongoRepository, surveyMongoRepository)
}
