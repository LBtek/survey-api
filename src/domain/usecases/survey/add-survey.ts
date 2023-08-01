import { type AddSurveyParams } from '@/domain/models/survey'

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
