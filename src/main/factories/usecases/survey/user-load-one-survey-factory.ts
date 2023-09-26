import { type IUserLoadOneSurvey } from '@/domain/usecases/user-context'
import { UserLoadOneSurvey } from '@/application/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'

export const makeUserLoadOneSurveyUsecase = (): IUserLoadOneSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new UserLoadOneSurvey(surveyMongoRepository)
}
