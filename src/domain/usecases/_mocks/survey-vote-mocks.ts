import { type SaveSurveyVote, type SaveSurveyVoteParams } from '@/domain/usecases/survey-vote/save-survey-vote'
import { type SurveyModel } from '@/domain/models/survey'
import { mockSurvey } from '@/domain/models/mocks'

export class SaveSurveyVoteSpy implements SaveSurveyVote {
  saveSurveyVoteData: SaveSurveyVoteParams
  beforeSurvey: SurveyModel
  afterSurvey: SurveyModel = {
    ...mockSurvey(),
    answers: mockSurvey().answers.map(a => {
      if (a.answer === 'any_answer') {
        a.amountVotes = 1
        a.percent = 100
      }
      return a
    }),
    totalAmountVotes: 1
  }

  async save (data: SaveSurveyVoteParams, survey: SurveyModel): Promise<SurveyModel> {
    this.saveSurveyVoteData = data
    this.beforeSurvey = survey
    return this.afterSurvey
  }
}
