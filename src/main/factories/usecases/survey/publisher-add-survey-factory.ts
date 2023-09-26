import { type IPublisherAddSurvey } from '@/domain/usecases/publisher-context'
import { PublisherAddSurvey } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makePublisherAddSurveyUsecase = (): IPublisherAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new PublisherAddSurvey(surveyMongoRepository)
}
