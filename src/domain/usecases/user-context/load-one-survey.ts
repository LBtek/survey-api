import { type UserLoadOneSurvey as UserLoadOneSurveyModel } from '@/domain/models'

export interface IUserLoadOneSurvey {
  load: (data: UserLoadOneSurveyModel.Params) => Promise<UserLoadOneSurveyModel.Result>
}
