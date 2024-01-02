import { type GuestLoadOneSurvey as GuestLoadOneSurveyModel } from '@/domain/models'

export interface IGuestLoadOneSurvey {
  load: (data: GuestLoadOneSurveyModel.Params) => Promise<GuestLoadOneSurveyModel.Result>
}
