import { type GuestSaveSurveyVote as GuestSaveSurveyVoteModel } from '@/domain/models'

export interface IGuestSaveSurveyVote {
  save: (data: GuestSaveSurveyVoteModel.Params) => Promise<GuestSaveSurveyVoteModel.Result>
}
