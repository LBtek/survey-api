import { type Survey } from '@/domain/entities'
import { type UserLoadAllSurveys } from '@/domain/usecases/user-context'
import { type UserLoadAllSurveysRepository } from '@/application/data/protocols/repositories/survey-repository'

export class DbUserLoadAllSurveys implements UserLoadAllSurveys {
  constructor (private readonly userLoadAllSurveysRepository: UserLoadAllSurveysRepository) { }

  async load (data: Survey.UserLoadAllSurveys.Params): Promise<Survey.UserLoadAllSurveys.Result> {
    const surveys = await this.userLoadAllSurveysRepository.loadAll(data)
    return surveys
  }
}
