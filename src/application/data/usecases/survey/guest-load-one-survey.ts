import { type GuestLoadOneSurvey as GuestLoadOneSurveyModel } from '@/domain/models'
import { type IGuestLoadOneSurvey as IGuestLoadOneSurveyUsecase } from '@/domain/usecases/guest-context'
import { type ILoadSurveyByIdRepository } from '@/application/data/protocols/repositories/survey-repository'
import { addPercentageToAnswers } from '../../helpers'

export class GuestLoadOneSurvey implements IGuestLoadOneSurveyUsecase {
  constructor (private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository) { }

  async load (data: GuestLoadOneSurveyModel.Params): Promise<GuestLoadOneSurveyModel.Result> {
    const survey = await this.loadSurveyByIdRepository.loadById({ id: data.surveyId })

    if (survey) {
      delete survey.publisherAccountId

      const surveyWithPercent = addPercentageToAnswers(survey)

      return surveyWithPercent as GuestLoadOneSurveyModel.Result
    }
  }
}
