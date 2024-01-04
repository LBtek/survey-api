import { type PublisherLoadOneSurvey as PublisherLoadOneSurveyModel } from '@/domain/models'

export interface IPublisherLoadOneSurvey {
  load: (data: PublisherLoadOneSurveyModel.Params) => Promise<PublisherLoadOneSurveyModel.Result>
}
