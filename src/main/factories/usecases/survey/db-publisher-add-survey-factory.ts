import { DbPublisherAddSurvey } from '@/application/data/usecases/survey'
import { type PublisherAddSurvey } from '@/domain/usecases/publisher-context'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeDbPublisherAddSurvey = (): PublisherAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbPublisherAddSurvey(surveyMongoRepository)
}
