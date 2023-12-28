import { type GuestSurveyVote, type UserSurveyVote } from '@/domain/entities'
import { type UserSaveSurveyVote, type AnswerToUserContext, type GuestSaveSurveyVote } from '@/domain/models'
import { type IUserSaveSurveyVote as IUserSaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { type IGuestSaveSurveyVote as IGuestSaveSurveyVoteUsecase } from '@/domain/usecases/guest-context'
import { mockSurvey } from '../models'

export class UserSaveSurveyVoteSpy implements IUserSaveSurveyVoteUsecase {
  saveSurveyVoteData: UserSurveyVote.BaseDataModel.Body
  afterSurvey: UserSaveSurveyVote.Result = {
    ...mockSurvey(),
    answers: mockSurvey().answers.map((answer: AnswerToUserContext) => {
      answer.isCurrentAccountAnswer = false
      if (answer.answer === 'any_answer') {
        answer.numberOfVotes = 1
        answer.percent = 100
        answer.isCurrentAccountAnswer = true
      }
      return answer
    }),
    totalNumberOfVotes: 1,
    didAnswer: true
  }

  async save (data: UserSaveSurveyVote.Params): Promise<UserSaveSurveyVote.Result> {
    this.saveSurveyVoteData = data
    return this.afterSurvey
  }
}

export class GuestSaveSurveyVoteSpy implements IGuestSaveSurveyVoteUsecase {
  saveSurveyVoteData: GuestSurveyVote.BaseDataModel.Body
  afterSurvey: GuestSaveSurveyVote.Result = {
    ...mockSurvey(),
    answers: mockSurvey().answers.map((answer: any) => {
      if (answer.answer === 'any_answer') {
        answer.numberOfVotes = 1
        answer.percent = 100
      }
      return answer
    }),
    totalNumberOfVotes: 1
  }

  async save (data: GuestSaveSurveyVote.Params): Promise<GuestSaveSurveyVote.Result> {
    this.saveSurveyVoteData = data
    return this.afterSurvey
  }
}
