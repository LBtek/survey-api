import { type UserLoadOneSurvey } from '@/domain/models'
import { type UserLoadOneSurvey as UserLoadOneSurveyUsecase } from '@/domain/usecases/user-context'
import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class UserLoadOneSurveyController implements Controller {
  constructor (private readonly userLoadOneSurvey: UserLoadOneSurveyUsecase) {}

  async handle (request: UserLoadOneSurvey.Params): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request
      const survey = await this.userLoadOneSurvey.load({ surveyId, accountId })
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return ok(survey)
    } catch (error) {
      return serverError(error)
    }
  }
}
