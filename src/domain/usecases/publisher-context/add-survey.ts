import { type PublisherAddSurvey as PublisherAddSurveyModel } from '@/domain/models'

export interface IPublisherAddSurvey {
  add: (data: PublisherAddSurveyModel.Params) => Promise<PublisherAddSurveyModel.Result>
}
