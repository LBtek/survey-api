import { type PublisherAddSurvey } from '@/domain/models'
import { type IPublisherAddSurvey as IPublisherAddSurveyUsecase } from '@/domain/usecases/publisher-context'
import { type IValidation, type IController, type HttpResponse } from '@/presentation/protocols'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'

export class PublisherAddSurveyController implements IController {
  constructor (
    private readonly validation: IValidation,
    private readonly publisherAddSurvey: IPublisherAddSurveyUsecase
  ) { }

  async handle (request: PublisherAddSurvey.Params): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = request
      const result = await this.publisherAddSurvey.add({
        question,
        answers,
        date: new Date()
      })
      if (result !== 'Ok' && result instanceof Error) {
        return badRequest(result)
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
