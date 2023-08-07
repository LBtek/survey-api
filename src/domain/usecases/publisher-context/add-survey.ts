import { type Survey } from '@/domain/entities'

export interface PublisherAddSurvey {
  add: (data: Survey.PublisherAddSurvey.Params) => Promise<Survey.PublisherAddSurvey.Result>
}
