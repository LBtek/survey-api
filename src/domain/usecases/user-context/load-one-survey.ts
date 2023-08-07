import { type Survey } from '@/domain/entities'

export interface UserLoadOneSurvey {
  load: (data: Survey.UserLoadOneSurvey.Params) => Promise<Survey.UserLoadOneSurvey.Result>
}
