import { type IController, type HttpResponse, type IValidation } from '@/presentation/protocols'
import { type IDeleteAccessTokenRepository } from '@/application/data/protocols/repositories'
import { type AuthenticationModel } from '@/application/models'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'

export class LogoutController implements IController {
  constructor (
    private readonly deleteAccessTokenRepository: IDeleteAccessTokenRepository,
    private readonly validation: IValidation
  ) { }

  async handle (request: AuthenticationModel.Logout.Params): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { ip, accessToken } = request
      await this.deleteAccessTokenRepository.deleteAccessToken({ ip, accessToken })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
