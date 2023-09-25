import { type AuthenticationModel } from '@/application/models'
import {
  type AuthParams,
  type AuthResult,
  type IAuthenticationService,
  type ILoadAuthenticatedUserByTokenService,
  type CheckSurveyAnswerParams,
  type ICheckSurveyContainsAnswerService,
  type ICheckAndRefreshAccessTokenService,
  type IExtractAccessTokenPayloadService
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

export class ExtractAccessTokenPayloadSpy implements IExtractAccessTokenPayloadService {
  extractData: AuthenticationModel.ExtractAccessTokenPayload.Params
  extractResult: AuthenticationModel.AccessTokenPayload = {
    userId: 'any_user_id',
    accountId: 'any_account_id',
    role: 'any_role' as AuthenticationModel.AccessTokenPayload['role'],
    willExpireIn: 0
  }

  async extract (data: AuthenticationModel.ExtractAccessTokenPayload.Params): Promise<AuthenticationModel.AccessTokenPayload> {
    this.extractData = data
    return this.extractResult
  }
}

export class LoadAuthenticatedUserByTokenSpy implements ILoadAuthenticatedUserByTokenService {
  loadData: AuthenticationModel.LoadUserByToken.Params
  roleResult = 'any_role' as AuthenticationModel.LoadUserByToken.Result['role']
  account = mockAccount()

  async loadByToken (data: AuthenticationModel.LoadUserByToken.Params): Promise<AuthenticationModel.LoadUserByToken.Result> {
    this.loadData = data
    return {
      accountId: this.account.accountId,
      user: this.account.user,
      role: this.roleResult
    }
  }
}

export class CheckAndRefreshAccessTokenSpy implements ICheckAndRefreshAccessTokenService {
  checkAndRefreshData: AuthenticationModel.CheckAndRefreshToken.Params
  result: AuthenticationModel.CheckAndRefreshToken.Result = 'new_access_token'

  async checkAndRefresh (data: AuthenticationModel.CheckAndRefreshToken.Params): Promise<AuthenticationModel.CheckAndRefreshToken.Result> {
    this.checkAndRefreshData = data
    return this.result
  }
}
