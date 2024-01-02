import { type IGuestLoadOneSurvey } from '@/domain/usecases/guest-context'
import { GuestLoadOneSurvey } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeGuestLoadOneSurveyUsecase = (): IGuestLoadOneSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new GuestLoadOneSurvey(surveyMongoRepository)
}
