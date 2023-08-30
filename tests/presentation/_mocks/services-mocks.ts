import { type AuthenticationModel } from '@/application/models'
import {
  type AuthParams,
  type AuthResult,
  type IAuthenticationService,
  type ILoadAuthenticatedUserByTokenService,
  type CheckSurveyAnswerParams,
  type ICheckSurveyContainsAnswerService
} from '@/presentation/protocols'
import { type UnauthorizedError } from '@/application/errors'
import { InvalidParamError } from '@/presentation/errors'
import { mockAccount } from '#/domain/mocks/models'

export class CheckSurveyAnswerServiceSpy implements ICheckSurveyContainsAnswerService {
  id: string
  answer: string
  error: InvalidParamError = new InvalidParamError('any_param')

  async verify (data: CheckSurveyAnswerParams): Promise<InvalidParamError> {
    this.answer = data.answer
    this.id = data.surveyId
    return this.error
  }
}

export class AuthenticationSpy implements IAuthenticationService {
  authenticationData: AuthParams
  authenticationResult: AuthResult | UnauthorizedError = {
    username: 'any_name',
    accessToken: 'any_token'
  }

  async auth (data: AuthParams): Promise<AuthResult | UnauthorizedError> {
    this.authenticationData = data
    return this.authenticationResult
  }
}

export class LoadAuthenticatedUserByTokenSpy implements ILoadAuthenticatedUserByTokenService {
  accessToken: string
  roles: AuthenticationModel.LoadUserByToken.Params['roles']
  account = mockAccount()

  async loadByToken (data: AuthenticationModel.LoadUserByToken.Params): Promise<AuthenticationModel.LoadUserByToken.Result> {
    this.accessToken = data.accessToken
    this.roles = data.roles
    return {
      accountId: this.account.accountId,
      user: this.account.user
    }
  }
}
