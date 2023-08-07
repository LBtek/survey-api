import {
  type AuthParams,
  type AuthResult,
  type AuthenticationService,
  type LoadUserAccountByTokenParams,
  type LoadUserAccountByTokenResult,
  type LoadUserAccountByTokenService,
  type CheckSurveyAnswerParams,
  type CheckSurveyContainsAnswerService
} from '@/presentation/protocols'
import { type UnauthorizedError } from '@/application/errors'
import { InvalidParamError } from '@/presentation/errors'
import { mockAccount } from '#/domain/mocks/models'

export class CheckSurveyAnswerServiceSpy implements CheckSurveyContainsAnswerService {
  id: string
  answer: string
  error: InvalidParamError = new InvalidParamError('any_param')

  async verify (data: CheckSurveyAnswerParams): Promise<InvalidParamError> {
    this.answer = data.answer
    this.id = data.surveyId
    return this.error
  }
}

export class AuthenticationSpy implements AuthenticationService {
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

export class LoadUserByAccountAccessTokenSpy implements LoadUserAccountByTokenService {
  accessToken: string
  role: string
  account = mockAccount()

  async loadByToken (data: LoadUserAccountByTokenParams): Promise<LoadUserAccountByTokenResult> {
    this.accessToken = data.accessToken
    this.role = data.role
    return {
      accountId: this.account.accountId,
      ...this.account.user
    }
  }
}
