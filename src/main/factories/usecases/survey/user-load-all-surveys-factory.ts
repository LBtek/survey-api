import { type IUserLoadAllSurveys } from '@/domain/usecases/user-context'
import { UserLoadAllSurveys } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeUserLoadAllSurveysUsecase = (): IUserLoadAllSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new UserLoadAllSurveys(surveyMongoRepository)
}
