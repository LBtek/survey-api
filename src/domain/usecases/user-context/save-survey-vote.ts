import { type SaveSurveyVote as SaveSurveyVoteModel } from '@/domain/models'

export interface ISaveSurveyVote {
  save: (data: SaveSurveyVoteModel.Params) => Promise<SaveSurveyVoteModel.Result>
}
