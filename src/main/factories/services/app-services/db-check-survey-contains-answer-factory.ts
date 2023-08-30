import { type ICheckSurveyContainsAnswerService } from '@/presentation/protocols/services'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'
import { DbCheckSurveyContainsAnswer } from '@/application/data/services'

export const makeCheckSurveyAnswerService = (): ICheckSurveyContainsAnswerService => {
  const surveyRepoitory = new SurveyMongoRepository()
  return new DbCheckSurveyContainsAnswer(surveyRepoitory)
}
