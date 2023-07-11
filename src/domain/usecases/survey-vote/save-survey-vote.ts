import { type SurveyModel } from '@/domain/models/survey'
import { type SurveyVoteModel } from '@/domain/models/survey-vote'

export type SaveSurveyVoteParams = Omit<SurveyVoteModel, 'id'>

export interface SaveSurveyVote {
  save: (data: SaveSurveyVoteParams, survey: SurveyModel) => Promise<SurveyModel>
}
