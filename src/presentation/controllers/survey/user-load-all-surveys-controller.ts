import { type UserLoadAllSurveys } from '@/domain/models'
import { type UserLoadAllSurveys as UserLoadAllSurveysUsecase } from '@/domain/usecases/user-context'
import { type Controller, type HttpResponse } from '@/presentation/protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class UserLoadAllSurveysController implements Controller {
  constructor (private readonly loadSurveys: UserLoadAllSurveysUsecase) {}

  async handle (request: UserLoadAllSurveys.Params): Promise<HttpResponse> {
    try {
      const { accountId } = request
      const surveys = await this.loadSurveys.load({ accountId })
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
