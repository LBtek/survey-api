import { type IGuestLoadAllSurveys as IGuestLoadAllSurveysUsecase } from '@/domain/usecases/guest-context'
import { type IController, type HttpResponse } from '@/presentation/protocols'
import { type Account } from '@/application/entities'
import { forbidden, noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/application/errors'

export class GuestLoadAllSurveysController implements IController {
  constructor (private readonly loadSurveys: IGuestLoadAllSurveysUsecase) {}

  async handle (request: { role?: Account.BaseDataModel.Roles }): Promise<HttpResponse> {
    try {
      if (request.role) return forbidden(new AccessDeniedError())
      const surveys = await this.loadSurveys.load()
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
