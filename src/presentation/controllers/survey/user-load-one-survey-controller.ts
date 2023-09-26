import { type UserLoadOneSurvey } from '@/domain/models'
import { type IUserLoadOneSurvey as IUserLoadOneSurveyUsecase } from '@/domain/usecases/user-context'
import { type IController, type HttpResponse } from '@/presentation/protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class UserLoadOneSurveyController implements IController {
  constructor (private readonly userLoadOneSurvey: IUserLoadOneSurveyUsecase) {}

  async handle (request: UserLoadOneSurvey.Params): Promise<HttpResponse> {
    try {
      const { surveyId, userId } = request
      const survey = await this.userLoadOneSurvey.load({ surveyId, userId })
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return ok(survey)
    } catch (error) {
      return serverError(error)
    }
  }
}
