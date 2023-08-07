import { type Survey } from '@/domain/entities'
import { type PublisherAddSurvey } from '@/domain/usecases/publisher-context'
import { type Validation, type Controller, type HttpResponse } from '@/presentation/protocols'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'

export class PublisherAddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly publisherAddSurvey: PublisherAddSurvey
  ) { }

  async handle (request: Survey.PublisherAddSurvey.Params): Promise<HttpResponse> {
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
