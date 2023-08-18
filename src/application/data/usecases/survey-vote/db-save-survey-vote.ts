import { type SaveSurveyVote, type AnswerToUserContext } from '@/domain/models'
import { type SaveSurveyVote as SaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { type SaveSurveyVoteRepository } from '@/application/data/protocols/repositories/survey-vote-repository'
import { type UserUpdateSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'

export class DbSaveSurveyVote implements SaveSurveyVoteUsecase {
  constructor (
    private readonly saveSurveyVoteRepository: SaveSurveyVoteRepository,
    private readonly userUpdateSurveyRepository: UserUpdateSurveyRepository
  ) { }

  async save (saveSurveyVoteData: SaveSurveyVote.Params): Promise<SaveSurveyVote.Result> {
    const oldSurveyVote = await this.saveSurveyVoteRepository.save(saveSurveyVoteData)
    const updatedSurvey = await this.userUpdateSurveyRepository.update({
      surveyId: saveSurveyVoteData.surveyId,
      oldAnswer: oldSurveyVote?.answer,
      newAnswer: saveSurveyVoteData.answer,
      accountId: saveSurveyVoteData.accountId
    })
    const newAnswers = updatedSurvey.answers.map((a: AnswerToUserContext) => {
      const answer = { ...a }
      answer.percent = Number(((answer.amountVotes / updatedSurvey.totalAmountVotes) * 100).toFixed(2))
      return answer
    })
    const surveyWithPercent = { ...updatedSurvey, answers: newAnswers }

    return surveyWithPercent
  }
}
