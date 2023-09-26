import { type UserLoadAllSurveys as UserLoadAllSurveysModel } from '@/domain/models'
import { type IUserLoadAllSurveys as IUserLoadAllSurveysUsecase } from '@/domain/usecases/user-context'
import { type IUserLoadAllSurveysRepository } from '@/application/data/protocols/repositories/survey-repository'
import { addPercentageToAnswers } from '../../helpers'

export class UserLoadAllSurveys implements IUserLoadAllSurveysUsecase {
  constructor (private readonly userLoadAllSurveysRepository: IUserLoadAllSurveysRepository) { }

  async load (data: UserLoadAllSurveysModel.Params): Promise<UserLoadAllSurveysModel.Result> {
    const surveys = await this.userLoadAllSurveysRepository.loadAll(data)

    const surveysWithPercent = surveys.map(survey => addPercentageToAnswers(survey))

    return surveysWithPercent
  }
}
