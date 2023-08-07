import { type UserLoadOneSurvey } from '@/domain/usecases/user-context'
import { DbUserLoadOneSurvey } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeDbUserLoadOneSurvey = (): UserLoadOneSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbUserLoadOneSurvey(surveyMongoRepository)
}
