import { type UserLoadOneSurvey } from '@/domain/models'
import { type IUserLoadOneSurvey as IUserLoadOneSurveyUsecase } from '@/domain/usecases/user-context'
import { type IController, type HttpResponse, type IValidation } from '@/presentation/protocols'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class UserLoadOneSurveyController implements IController {
  constructor (
    private readonly userLoadOneSurvey: IUserLoadOneSurveyUsecase,
    private readonly validation: IValidation
  ) {}

  async handle (request: UserLoadOneSurvey.Params): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
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
