import { type UserLoadOneSurvey as UserLoadOneSurveyModel } from '@/domain/models'
import { type IUserLoadOneSurvey as IUserLoadOneSurveyUsecase } from '@/domain/usecases/user-context'
import { type ILoadOneSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'
import { addPercentageToAnswers } from '../../helpers'

export class UserLoadOneSurvey implements IUserLoadOneSurveyUsecase {
  constructor (private readonly userLoadOneSurveyRepository: ILoadOneSurveyRepository) { }

  async load (data: UserLoadOneSurveyModel.Params): Promise<UserLoadOneSurveyModel.Result> {
    const survey = await this.userLoadOneSurveyRepository.loadSurvey({
      surveyId: data.surveyId,
      userOrGuestId: data.userId,
      type: 'user'
    })

    const surveyWithPercent = addPercentageToAnswers(survey)

    return surveyWithPercent as UserLoadOneSurveyModel.Result
  }
}
