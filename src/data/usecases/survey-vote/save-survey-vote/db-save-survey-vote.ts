import {
  type SurveyModel,
  type SaveSurveyVote,
  type SaveSurveyVoteParams,
  type SaveSurveyVoteRepository,
  type UpdateSurveyRepository
} from './db-save-survey-vote-protocols'

export class DbSaveSurveyVote implements SaveSurveyVote {
  constructor (
    private readonly saveSurveyVoteRepository: SaveSurveyVoteRepository,
    private readonly updateSurveyRepository: UpdateSurveyRepository
  ) { }

  async save (saveSurveyVoteData: SaveSurveyVoteParams): Promise<SurveyModel> {
    const oldSurveyVote = await this.saveSurveyVoteRepository.save(saveSurveyVoteData)
    const updatedSurvey = await this.updateSurveyRepository.update(
      saveSurveyVoteData.surveyId,
      oldSurveyVote?.answer,
      saveSurveyVoteData.answer,
      saveSurveyVoteData.accountId
    )
    const surveyWithPercent = { ...updatedSurvey }
    surveyWithPercent.answers = updatedSurvey.answers.map(a => {
      const answer = { ...a }
      answer.percent = Number(((answer.amountVotes / updatedSurvey.totalAmountVotes) * 100).toFixed(2))
      return answer
    })
    return surveyWithPercent
  }
}
