import { type GuestLoadOneSurvey } from '@/domain/models'
import { type IGuestLoadOneSurvey as IGuestLoadOneSurveyUsecase } from '@/domain/usecases/guest-context'
import { type IController, type HttpResponse, type IValidation } from '@/presentation/protocols'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class GuestLoadOneSurveyController implements IController {
  constructor (
    private readonly guestLoadOneSurvey: IGuestLoadOneSurveyUsecase,
    private readonly validation: IValidation
  ) {}

  async handle (request: GuestLoadOneSurvey.Params): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { surveyId } = request
      const survey = await this.guestLoadOneSurvey.load({ surveyId })
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return ok(survey)
    } catch (error) {
      return serverError(error)
    }
  }
}
