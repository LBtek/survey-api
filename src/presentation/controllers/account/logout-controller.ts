import { type IController, type HttpResponse } from '@/presentation/protocols'
import { type IDeleteAccessTokenRepository } from '@/application/data/protocols/repositories'
import { type AuthenticationModel } from '@/application/models'
import { noContent, serverError } from '@/presentation/helpers/http/http-helper'

export class LogoutController implements IController {
  constructor (
    private readonly deleteAccessTokenRepository: IDeleteAccessTokenRepository
  ) { }

  async handle (request: AuthenticationModel.Logout.Params): Promise<HttpResponse> {
    try {
      const { ip, accessToken } = request
      await this.deleteAccessTokenRepository.deleteAccessToken({ ip, accessToken })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
