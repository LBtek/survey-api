import { type Survey } from '@/domain/entities'
import { type UserLoadOneSurvey } from '@/domain/usecases/user-context'
import { type UserLoadOneSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'

export class DbUserLoadOneSurvey implements UserLoadOneSurvey {
  constructor (private readonly userLoadOneSurveyRepository: UserLoadOneSurveyRepository) { }

  async load (data: Survey.UserLoadOneSurvey.Params): Promise<Survey.UserLoadOneSurvey.Result> {
    const survey = await this.userLoadOneSurveyRepository.loadSurvey(data)
    return survey
  }
}
