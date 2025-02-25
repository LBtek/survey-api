import { type AuthenticationModel } from '@/application/models'
import { type IAuthenticationService, type IController, type HttpResponse, type IValidation } from '@/presentation/protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { UnauthorizedError } from '@/application/errors'

export class LoginController implements IController {
  constructor (
    private readonly authentication: IAuthenticationService,
    private readonly validation: IValidation
  ) { }

  async handle (request: AuthenticationModel.Login.Params): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password, ip, role } = request
      const authenticationResponse = await this.authentication.auth({ ip, email, password, role })
      if (authenticationResponse instanceof UnauthorizedError) {
        return unauthorized()
      }
      return ok(authenticationResponse)
    } catch (error) {
      return serverError(error)
    }
  }
}
