import { type LoadSurvey } from '@/domain/usecases/survey/load-survey'
import { DbLoadSurvey } from '@/data/usecases/survey/load-survey/db-load-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurvey = (): LoadSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurvey(surveyMongoRepository)
}
