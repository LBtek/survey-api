import { type Survey, type SurveyVote } from '@/domain/entities'
import { type UserSaveSurveyVote } from '@/domain/usecases/user-context'
import { mockSurvey } from '../models'

export class UserSaveSurveyVoteSpy implements UserSaveSurveyVote {
  saveSurveyVoteData: SurveyVote.BaseDataModel.Body
  afterSurvey: SurveyVote.Save.Result = {
    ...mockSurvey(),
    answers: mockSurvey().answers.map((answer: Survey.AnswerToUserContext) => {
      answer.isCurrentAccountAnswer = false
      if (answer.answer === 'any_answer') {
        answer.amountVotes = 1
        answer.percent = 100
        answer.isCurrentAccountAnswer = true
      }
      return answer
    }),
    totalAmountVotes: 1,
    didAnswer: true
  }

  async save (data: SurveyVote.Save.Params): Promise<SurveyVote.Save.Result> {
    this.saveSurveyVoteData = data
    return this.afterSurvey
  }
}
