import { type SaveSurveyVoteParams } from '@/domain/usecases/survey-vote/save-survey-vote'
import { type SurveyVoteModel } from '../survey-vote'

const date = new Date()

export const mockSaveSurveyVoteParams = (): SaveSurveyVoteParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date
})

export const mockSurveyVote = (): SurveyVoteModel => ({
  id: 'any_survey_vote_id',
  ...mockSaveSurveyVoteParams()
})
