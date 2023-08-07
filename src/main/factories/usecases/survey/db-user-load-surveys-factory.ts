import { type UserLoadAllSurveys } from '@/domain/usecases/user-context'
import { DbUserLoadAllSurveys } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeDbUserLoadAllSurveys = (): UserLoadAllSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbUserLoadAllSurveys(surveyMongoRepository)
}
