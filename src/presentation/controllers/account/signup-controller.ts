import { type AddUserAccountModel } from '@/domain/models'
import { type IAddUserAccount as IAddUserAccountUsecase } from '@/domain/usecases/user-context'
import { type HttpResponse, type Controller, type Validation, type IAuthenticationService } from '@/presentation/protocols'
import { type IP } from '@/application/entities'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { EmailInUserError } from '@/domain/errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addUserAccount: IAddUserAccountUsecase,
    private readonly validation: Validation,
    private readonly authentication: IAuthenticationService
  ) { }

  async handle (request: { ip: IP } & Omit<AddUserAccountModel.Params, 'role'>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const role: AddUserAccountModel.Params['role'] = 'basic_user'
      const { name, email, password, ip } = request
      const result = await this.addUserAccount.add({
        name,
        email,
        password,
        role
      })
      if (result instanceof EmailInUserError) {
        return forbidden(result)
      }
      const authenticationResponse = await this.authentication.auth({ ip, email, password, role })
      return ok(authenticationResponse)
    } catch (error) {
      return serverError(error)
    }
  }
}
