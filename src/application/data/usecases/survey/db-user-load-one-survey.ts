import { type UserLoadOneSurvey } from '@/domain/models'
import { type UserLoadOneSurvey as UserLoadOneSurveyUsecase } from '@/domain/usecases/user-context'
import { type UserLoadOneSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'

export class DbUserLoadOneSurvey implements UserLoadOneSurveyUsecase {
  constructor (private readonly userLoadOneSurveyRepository: UserLoadOneSurveyRepository) { }

  async load (data: UserLoadOneSurvey.Params): Promise<UserLoadOneSurvey.Result> {
    const survey = await this.userLoadOneSurveyRepository.loadSurvey(data)
    return survey
  }
}
