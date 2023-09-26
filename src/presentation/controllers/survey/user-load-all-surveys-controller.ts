import { type UserLoadAllSurveys } from '@/domain/models'
import { type IUserLoadAllSurveys as IUserLoadAllSurveysUsecase } from '@/domain/usecases/user-context'
import { type IController, type HttpResponse } from '@/presentation/protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class UserLoadAllSurveysController implements IController {
  constructor (private readonly loadSurveys: IUserLoadAllSurveysUsecase) {}

  async handle (request: UserLoadAllSurveys.Params): Promise<HttpResponse> {
    try {
      const { userId } = request
      const surveys = await this.loadSurveys.load({ userId })
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
