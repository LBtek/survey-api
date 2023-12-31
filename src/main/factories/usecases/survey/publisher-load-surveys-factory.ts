import { type IPublisherLoadSurveys } from '@/domain/usecases/publisher-context'
import { PublisherLoadSurveys } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makePublisherLoadSurveysUsecase = (): IPublisherLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new PublisherLoadSurveys(surveyMongoRepository)
}
