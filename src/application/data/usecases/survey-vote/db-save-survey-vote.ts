import { type SaveSurveyVote } from '@/domain/models'
import { type SaveSurveyVote as SaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { type SaveSurveyVoteRepository } from '@/application/data/protocols/repositories/survey-vote-repository'
import { type UserUpdateSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'
import { addPercentageToAnswers } from '../../helpers'

export class DbSaveSurveyVote implements SaveSurveyVoteUsecase {
  constructor (
    private readonly saveSurveyVoteRepository: SaveSurveyVoteRepository,
    private readonly userUpdateSurveyRepository: UserUpdateSurveyRepository
  ) { }

  async save (saveSurveyVoteData: SaveSurveyVote.Params): Promise<SaveSurveyVote.Result> {
    const oldSurveyVote = await this.saveSurveyVoteRepository.save(saveSurveyVoteData)
    const updatedSurvey = await this.userUpdateSurveyRepository.update({
      userId: saveSurveyVoteData.userId,
      surveyId: saveSurveyVoteData.surveyId,
      oldAnswer: oldSurveyVote?.answer,
      newAnswer: saveSurveyVoteData.answer
    })
    const surveyWithPercent = addPercentageToAnswers(updatedSurvey)

    return surveyWithPercent
  }
}
