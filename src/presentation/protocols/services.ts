import { type Authentication } from '@/application/models'
import { type InvalidParamError } from '../errors'
import { type UnauthorizedError } from '@/application/errors'

export type AuthParams = Authentication.Login.Params
export type AuthResult = Authentication.Login.Result

export interface AuthenticationService {
  auth: (data: AuthParams) => Promise<AuthResult | UnauthorizedError>
}

export interface LoadUserAccountByTokenService {
  loadByToken: (data: Authentication.LoadUserByToken.Params) => Promise<Authentication.LoadUserByToken.Result>
}

export type CheckSurveyAnswerParams = {
  surveyId: string
  answer: string
}

export interface CheckSurveyContainsAnswerService {
  verify: (data: CheckSurveyAnswerParams) => Promise<InvalidParamError>
}
