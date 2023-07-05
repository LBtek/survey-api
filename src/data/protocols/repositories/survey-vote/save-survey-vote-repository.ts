import { type SurveyVoteModel } from '@/domain/models/survey-vote'
import { type SaveSurveyVoteParams } from '@/domain/usecases/survey-vote/save-survey-vote'

export interface SaveSurveyVoteRepository {
  save: (data: SaveSurveyVoteParams) => Promise<SurveyVoteModel>
}
