import { type Survey } from '@/domain/entities'

export interface UserLoadAllSurveys {
  load: (data: Survey.UserLoadAllSurveys.Params) => Promise<Survey.UserLoadAllSurveys.Result>
}
