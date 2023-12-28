import { type UserSurveyVote } from '@/domain/entities'
import { type GuestSaveSurveyVote, type UserSaveSurveyVote } from '@/domain/models'

const date = new Date()

export const mockUserSaveSurveyVoteParams = (): UserSaveSurveyVote.Params => ({
  surveyId: 'any_survey_id',
  userId: 'any_user_id',
  answer: 'any_answer',
  date
})

export const mockUserSurveyVote = (): UserSurveyVote.BaseDataModel.Body & { id: string } => ({
  id: 'any_survey_vote_id',
  ...mockUserSaveSurveyVoteParams()
})

export const mockGuestSaveSurveyVoteParams = (): GuestSaveSurveyVote.Params => ({
  surveyId: 'any_survey_id',
  guestId: 'any_guest_id',
  guestAgentId: 'any_guest_agent_id',
  answer: 'any_answer',
  date
})
