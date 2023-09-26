import { type SaveSurveyVote as SaveSurveyVoteModel } from '@/domain/models'
import { type ISaveSurveyVote as ISaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { type ISaveSurveyVoteRepository } from '@/application/data/protocols/repositories/survey-vote-repository'
import { type IUserUpdateSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'
import { addPercentageToAnswers } from '../../helpers'

export class SaveSurveyVote implements ISaveSurveyVoteUsecase {
  constructor (
    private readonly saveSurveyVoteRepository: ISaveSurveyVoteRepository,
    private readonly userUpdateSurveyRepository: IUserUpdateSurveyRepository
  ) { }

  async save (saveSurveyVoteData: SaveSurveyVoteModel.Params): Promise<SaveSurveyVoteModel.Result> {
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
