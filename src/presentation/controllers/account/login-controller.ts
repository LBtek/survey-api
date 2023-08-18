import { type Authentication } from '@/application/models'
import { type AuthenticationService, type Controller, type HttpResponse, type Validation } from '@/presentation/protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { UnauthorizedError } from '@/application/errors'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: AuthenticationService,
    private readonly validation: Validation
  ) { }

  async handle (request: Authentication.Login.Params): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
      const authenticationResponse = await this.authentication.auth({ email, password })
      if (authenticationResponse instanceof UnauthorizedError) {
        return unauthorized()
      }
      return ok(authenticationResponse)
    } catch (error) {
      return serverError(error)
    }
  }
}
