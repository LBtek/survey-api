import { type GuestSaveSurveyVote as GuestSaveSurveyVoteModel } from '@/domain/models'
import { type IGuestSaveSurveyVote as IGuestSaveSurveyVoteUsecase } from '@/domain/usecases/guest-context'
import { type IGuestSaveSurveyVoteRepository, type IGuestUpdateSurveyRepository } from '../../protocols/repositories'
import { addPercentageToAnswers } from '../../helpers'

export class GuestSaveSurveyVote implements IGuestSaveSurveyVoteUsecase {
  constructor (
    private readonly guestSaveSurveyVoteRepository: IGuestSaveSurveyVoteRepository,
    private readonly guestUpdateSurveyRepository: IGuestUpdateSurveyRepository
  ) { }

  async save (data: GuestSaveSurveyVoteModel.Params): Promise<GuestSaveSurveyVoteModel.Result> {
    const oldSurveyVote = await this.guestSaveSurveyVoteRepository.guestSaveVote(data)
    const updatedSurvey = await this.guestUpdateSurveyRepository.update({
      type: 'guest',
      userOrGuestId: data.guestId,
      surveyId: data.surveyId,
      oldAnswer: oldSurveyVote?.answer,
      newAnswer: data.answer
    })
    const surveyWithPercent = addPercentageToAnswers(updatedSurvey)

    return surveyWithPercent
  }
}
