import { type IGuestLoadAllSurveys } from '@/domain/usecases/guest-context'
import { GuestLoadAllSurveys } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeGuestLoadAllSurveysUsecase = (): IGuestLoadAllSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new GuestLoadAllSurveys(surveyMongoRepository)
}
