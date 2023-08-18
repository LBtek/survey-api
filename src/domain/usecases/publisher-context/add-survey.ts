import { type PublisherAddSurvey as PublisherAddSurveyModel } from '@/domain/models'

export interface PublisherAddSurvey {
  add: (data: PublisherAddSurveyModel.Params) => Promise<PublisherAddSurveyModel.Result>
}
