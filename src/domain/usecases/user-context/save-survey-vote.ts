import { type SaveSurveyVote as SaveSurveyVoteModel } from '@/domain/models'

export interface SaveSurveyVote {
  save: (data: SaveSurveyVoteModel.Params) => Promise<SaveSurveyVoteModel.Result>
}
