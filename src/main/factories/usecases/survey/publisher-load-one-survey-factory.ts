import { type IPublisherLoadOneSurvey } from '@/domain/usecases/publisher-context'
import { PublisherLoadOneSurvey } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makePublisherLoadOneSurveyUsecase = (): IPublisherLoadOneSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new PublisherLoadOneSurvey(surveyMongoRepository)
}
