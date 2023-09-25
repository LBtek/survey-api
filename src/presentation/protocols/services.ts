import { type AuthenticationModel } from '@/application/models'
import { type InvalidParamError } from '../errors'
import { type UnauthorizedError } from '@/application/errors'
import { type SurveyID } from '@/domain/entities'

export type AuthParams = AuthenticationModel.Login.Params
export type AuthResult = AuthenticationModel.Login.Result

export interface IAuthenticationService {
  auth: (data: AuthParams) => Promise<AuthResult | UnauthorizedError>
}

export interface IExtractAccessTokenPayloadService {
  extract: (data: AuthenticationModel.ExtractAccessTokenPayload.Params) => Promise<AuthenticationModel.ExtractAccessTokenPayload.Result>
}

export interface ILoadAuthenticatedUserByTokenService {
  loadByToken: (data: AuthenticationModel.LoadUserByToken.Params) => Promise<AuthenticationModel.LoadUserByToken.Result>
}

export interface ICheckAndRefreshAccessTokenService {
  checkAndRefresh: (data: AuthenticationModel.CheckAndRefreshToken.Params) => Promise<AuthenticationModel.CheckAndRefreshToken.Result>
}

export type CheckSurveyAnswerParams = {
  surveyId: SurveyID
  answer: string
}

export interface ICheckSurveyContainsAnswerService {
  verify: (data: CheckSurveyAnswerParams) => Promise<InvalidParamError>
}
