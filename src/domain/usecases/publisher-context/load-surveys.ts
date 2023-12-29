import { type PublisherLoadSurveys as PublisherLoadSurveysModel } from '@/domain/models'

export interface IPublisherLoadSurveys {
  load: (data: PublisherLoadSurveysModel.Params) => Promise<PublisherLoadSurveysModel.Result>
}
