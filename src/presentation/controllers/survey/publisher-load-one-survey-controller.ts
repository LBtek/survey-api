import { type SurveyID } from '@/domain/entities'
import { type AccountID } from '@/application/entities'
import { type IPublisherLoadOneSurvey as IPublisherLoadOneSurveyUsecase } from '@/domain/usecases/publisher-context'
import { type IValidation, type HttpResponse, type IController } from '@/presentation/protocols'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

export class PublisherLoadOneSurveyController implements IController {
  constructor (
    private readonly publisherLoadOneSurvey: IPublisherLoadOneSurveyUsecase,
    private readonly validation: IValidation
  ) { }

  async handle (request: { accountId: AccountID, surveyId: SurveyID }): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { accountId, surveyId } = request

      const survey = await this.publisherLoadOneSurvey.load({ surveyId, publisherAccountId: accountId })

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return ok(survey)
    } catch (error) {
      return serverError(error)
    }
  }
}
