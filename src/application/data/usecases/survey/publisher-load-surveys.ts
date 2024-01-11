import { type PublisherLoadSurveys as PublisherLoadSurveysModel } from '@/domain/models'
import { type IPublisherLoadSurveys } from '@/domain/usecases/publisher-context'
import { type IPublisherLoadSurveysRepository } from '../../protocols/repositories'
import { addPercentageToAnswers } from '../../helpers'

export class PublisherLoadSurveys implements IPublisherLoadSurveys {
  constructor (private readonly publisherLoadSurveysRepository: IPublisherLoadSurveysRepository) { }

  async load (data: PublisherLoadSurveysModel.Params): Promise<PublisherLoadSurveysModel.Result> {
    const surveys = await this.publisherLoadSurveysRepository.publisherLoadSurveys(data)

    const surveysWithPercent = surveys.map(survey => addPercentageToAnswers(survey)) as any

    return surveysWithPercent
  }
}
