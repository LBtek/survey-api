import { type PublisherLoadOneSurvey as PublisherLoadOneSurveyModel } from '@/domain/models'
import { type IPublisherLoadOneSurvey as IPublisherLoadOneSurveyUsecase } from '@/domain/usecases/publisher-context'
import { type ILoadSurveyByIdRepository } from '@/application/data/protocols/repositories/survey-repository'
import { addPercentageToAnswers } from '../../helpers'

export class PublisherLoadOneSurvey implements IPublisherLoadOneSurveyUsecase {
  constructor (private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository) { }

  async load (data: PublisherLoadOneSurveyModel.Params): Promise<PublisherLoadOneSurveyModel.Result> {
    const survey = await this.loadSurveyByIdRepository.loadById({ id: data.surveyId })

    if (survey && survey.publisherAccountId === data.publisherAccountId) {
      const surveyWithPercent = addPercentageToAnswers(survey) as any

      return surveyWithPercent
    }
  }
}
