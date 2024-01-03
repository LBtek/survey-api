import { type GuestLoadAllSurveys as GuestLoadAllSurveysModel } from '@/domain/models'

export interface IGuestLoadAllSurveys {
  load: () => Promise<GuestLoadAllSurveysModel.Result>
}
