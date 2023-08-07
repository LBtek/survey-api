import { type Account } from '@/domain/entities'
import { type AddUserAccount } from '@/domain/usecases/user-context'
import { type HttpResponse, type Controller, type Validation, type AuthenticationService } from '@/presentation/protocols'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { EmailInUserError } from '@/domain/errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addUserAccount: AddUserAccount,
    private readonly validation: Validation,
    private readonly authentication: AuthenticationService
  ) { }

  async handle (request: Account.AddUserAccount.Params): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      const result = await this.addUserAccount.add({
        name,
        email,
        password
      })
      if (result instanceof EmailInUserError) {
        return forbidden(result)
      }
      const authenticationResponse = await this.authentication.auth({ email, password })
      return ok(authenticationResponse)
    } catch (error) {
      return serverError(error)
    }
  }
}
