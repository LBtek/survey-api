import { type GuestLoadOneSurvey } from '@/domain/models'
import { type IGuestLoadOneSurvey as IGuestLoadOneSurveyUsecase } from '@/domain/usecases/guest-context'
import { type IController, type HttpResponse, type IValidation } from '@/presentation/protocols'
import { type Account } from '@/application/entities'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { AccessDeniedError } from '@/application/errors'

export class GuestLoadOneSurveyController implements IController {
  constructor (
    private readonly guestLoadOneSurvey: IGuestLoadOneSurveyUsecase,
    private readonly validation: IValidation
  ) {}

  async handle (request: GuestLoadOneSurvey.Params & { role?: Account.BaseDataModel.Roles }): Promise<HttpResponse> {
    try {
      if (request.role) return forbidden(new AccessDeniedError())
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
