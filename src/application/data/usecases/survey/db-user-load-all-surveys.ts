import { type UserLoadAllSurveys } from '@/domain/models'
import { type UserLoadAllSurveys as UserLoadAllSurveysUsecase } from '@/domain/usecases/user-context'
import { type UserLoadAllSurveysRepository } from '@/application/data/protocols/repositories/survey-repository'
import { addPercentageToAnswers } from '../../helpers'

export class DbUserLoadAllSurveys implements UserLoadAllSurveysUsecase {
  constructor (private readonly userLoadAllSurveysRepository: UserLoadAllSurveysRepository) { }

  async load (data: UserLoadAllSurveys.Params): Promise<UserLoadAllSurveys.Result> {
    const surveys = await this.userLoadAllSurveysRepository.loadAll(data)

    const surveysWithPercent = surveys.map(survey => addPercentageToAnswers(survey))

    return surveysWithPercent
  }
}
