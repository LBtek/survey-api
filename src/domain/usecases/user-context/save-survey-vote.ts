import { type SurveyVote } from '@/domain/entities'

export interface UserSaveSurveyVote {
  save: (data: SurveyVote.Save.Params) => Promise<SurveyVote.Save.Result>
}
