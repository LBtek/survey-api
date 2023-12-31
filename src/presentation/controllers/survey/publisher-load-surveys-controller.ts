import { type AccountID } from '@/application/entities'
import { type IPublisherLoadSurveys as IPublisherLoadSurveysUsecase } from '@/domain/usecases/publisher-context'
import { type HttpResponse, type IController } from '@/presentation/protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class PublisherLoadSurveysController implements IController {
  constructor (private readonly publisherLoadSurveys: IPublisherLoadSurveysUsecase) { }

  async handle (request: { accountId: AccountID }): Promise<HttpResponse> {
    try {
      const { accountId } = request
      const surveys = await this.publisherLoadSurveys.load({ publisherAccountId: accountId })
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
