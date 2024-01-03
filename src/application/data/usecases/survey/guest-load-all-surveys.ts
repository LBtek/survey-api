import { type IGuestLoadAllSurveysRepository } from '@/application/data/protocols/repositories/survey-repository'
import { type IGuestLoadAllSurveys as IGuestLoadAllSurveysUsecase } from '@/domain/usecases/guest-context'
import { type GuestLoadAllSurveys as GuestLoadAllSurveysModel } from '@/domain/models'
import { addPercentageToAnswers } from '../../helpers'

export class GuestLoadAllSurveys implements IGuestLoadAllSurveysUsecase {
  constructor (private readonly guestLoadAllSurveysRepository: IGuestLoadAllSurveysRepository) { }

  async load (): Promise<GuestLoadAllSurveysModel.Result> {
    const surveys = await this.guestLoadAllSurveysRepository.guestLoadAllSurveys()

    const surveysWithPercent = surveys.map(survey => addPercentageToAnswers(survey))

    return surveysWithPercent as GuestLoadAllSurveysModel.Result
  }
}
