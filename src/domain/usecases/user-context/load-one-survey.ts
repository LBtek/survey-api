import { type UserLoadOneSurvey as UserLoadOneSurveyModel } from '@/domain/models'

export interface UserLoadOneSurvey {
  load: (data: UserLoadOneSurveyModel.Params) => Promise<UserLoadOneSurveyModel.Result>
}
