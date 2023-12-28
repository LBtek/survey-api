import { type UserSaveSurveyVote as UserSaveSurveyVoteModel } from '@/domain/models'
import { type IUserSaveSurveyVote as IUserSaveSurveyVoteUsecase } from '@/domain/usecases/user-context'
import { type IUserSaveSurveyVoteRepository, type IUserUpdateSurveyRepository } from '../../protocols/repositories'
import { addPercentageToAnswers } from '../../helpers'

export class UserSaveSurveyVote implements IUserSaveSurveyVoteUsecase {
  constructor (
    private readonly userSaveSurveyVoteRepository: IUserSaveSurveyVoteRepository,
    private readonly userUpdateSurveyRepository: IUserUpdateSurveyRepository
  ) { }

  async save (saveSurveyVoteData: UserSaveSurveyVoteModel.Params): Promise<UserSaveSurveyVoteModel.Result> {
    const oldSurveyVote = await this.userSaveSurveyVoteRepository.userSaveVote(saveSurveyVoteData)
    const updatedSurvey = await this.userUpdateSurveyRepository.update({
      type: 'user',
      userOrGuestId: saveSurveyVoteData.userId,
      surveyId: saveSurveyVoteData.surveyId,
      oldAnswer: oldSurveyVote?.answer,
      newAnswer: saveSurveyVoteData.answer
    })
    const surveyWithPercent = addPercentageToAnswers(updatedSurvey)

    return surveyWithPercent as UserSaveSurveyVoteModel.Result
  }
}
