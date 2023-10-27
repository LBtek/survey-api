import { type SurveyVote } from '@/domain/entities'
import { type SaveSurveyVote, type AnswerToUserContext } from '@/domain/models'
import { type ISaveSurveyVote as ISaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { mockSurvey } from '../models'

export class SaveSurveyVoteSpy implements ISaveSurveyVoteUsecase {
  saveSurveyVoteData: SurveyVote.BaseDataModel.Body
  afterSurvey: SaveSurveyVote.Result = {
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

  async save (data: SaveSurveyVote.Params): Promise<SaveSurveyVote.Result> {
    this.saveSurveyVoteData = data
    return this.afterSurvey
  }
}
