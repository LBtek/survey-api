import { type Survey, type SurveyVote } from '@/domain/entities'
import { type UserSaveSurveyVote } from '@/domain/usecases/user-context'
import { type UserSaveSurveyVoteRepository } from '@/application/data/protocols/repositories/survey-vote-repository'
import { type UserUpdateSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'

export class DbUserSaveSurveyVote implements UserSaveSurveyVote {
  constructor (
    private readonly saveSurveyVoteRepository: UserSaveSurveyVoteRepository,
    private readonly userUpdateSurveyRepository: UserUpdateSurveyRepository
  ) { }

  async save (saveSurveyVoteData: SurveyVote.Save.Params): Promise<SurveyVote.Save.Result> {
    const oldSurveyVote = await this.saveSurveyVoteRepository.save(saveSurveyVoteData)
    const updatedSurvey = await this.userUpdateSurveyRepository.update({
      surveyId: saveSurveyVoteData.surveyId,
      oldAnswer: oldSurveyVote?.answer,
      newAnswer: saveSurveyVoteData.answer,
      accountId: saveSurveyVoteData.accountId
    })
    const newAnswers = updatedSurvey.answers.map((a: Survey.AnswerToUserContext) => {
      const answer = { ...a }
      answer.percent = Number(((answer.amountVotes / updatedSurvey.totalAmountVotes) * 100).toFixed(2))
      return answer
    })
    const surveyWithPercent = { ...updatedSurvey, answers: newAnswers }

    return surveyWithPercent
  }
}
