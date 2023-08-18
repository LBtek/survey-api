import { type SurveyVote } from '@/domain/entities'
import { type SaveSurveyVote } from '@/domain/models'

const date = new Date()

export const mockSaveSurveyVoteParams = (): SaveSurveyVote.Params => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date
})

export const mockSurveyVote = (): SurveyVote.BaseDataModel.Body & { id: string } => ({
  id: 'any_survey_vote_id',
  ...mockSaveSurveyVoteParams()
})
