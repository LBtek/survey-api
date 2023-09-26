import { type UserLoadAllSurveys as UserLoadAllSurveysModel } from '@/domain/models'

export interface IUserLoadAllSurveys {
  load: (data: UserLoadAllSurveysModel.Params) => Promise<UserLoadAllSurveysModel.Result>
}
