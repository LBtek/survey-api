import { type PublisherLoadSurveys as PublisherLoadSurveysModel } from '@/domain/models'
import { type IPublisherLoadSurveys } from '@/domain/usecases/publisher-context'
import { type IPublisherLoadSurveysRepository } from '../../protocols/repositories'

export class PublisherLoadSurveys implements IPublisherLoadSurveys {
  constructor (private readonly publisherLoadSurveysRepository: IPublisherLoadSurveysRepository) { }

  async load (data: PublisherLoadSurveysModel.Params): Promise<PublisherLoadSurveysModel.Result> {
    const surveys = await this.publisherLoadSurveysRepository.publisherLoadSurveys(data)
    return surveys
  }
}
