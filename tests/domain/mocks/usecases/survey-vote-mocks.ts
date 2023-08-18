import { type SurveyVote } from '@/domain/entities'
import { type SaveSurveyVote, type AnswerToUserContext } from '@/domain/models'
import { type SaveSurveyVote as SaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { mockSurvey } from '../models'

export class SaveSurveyVoteSpy implements SaveSurveyVoteUsecase {
  saveSurveyVoteData: SurveyVote.BaseDataModel.Body
  afterSurvey: SaveSurveyVote.Result = {
    ...mockSurvey(),
    answers: mockSurvey().answers.map((answer: AnswerToUserContext) => {
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

  async save (data: SaveSurveyVote.Params): Promise<SaveSurveyVote.Result> {
    this.saveSurveyVoteData = data
    return this.afterSurvey
  }
}
