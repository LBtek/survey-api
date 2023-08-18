import { type UserLoadAllSurveys as UserLoadAllSurveysModel } from '@/domain/models'

export interface UserLoadAllSurveys {
  load: (data: UserLoadAllSurveysModel.Params) => Promise<UserLoadAllSurveysModel.Result>
}
