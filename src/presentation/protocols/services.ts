import { type Account } from '@/domain/entities'
import { type InvalidParamError } from '../errors'
import { type UnauthorizedError } from '@/application/errors'

export type AuthParams = Account.Authentication.Login.Params
export type AuthResult = Account.Authentication.Login.Result

export interface AuthenticationService {
  auth: (data: AuthParams) => Promise<AuthResult | UnauthorizedError>
}

export type LoadUserAccountByTokenParams = Account.Authentication.LoadUserByToken.Params
export type LoadUserAccountByTokenResult = Account.Authentication.LoadUserByToken.Result

export interface LoadUserAccountByTokenService {
  loadByToken: (data: LoadUserAccountByTokenParams) => Promise<LoadUserAccountByTokenResult>
}

export type CheckSurveyAnswerParams = {
  surveyId: string
  answer: string
}

export interface CheckSurveyContainsAnswerService {
  verify: (data: CheckSurveyAnswerParams) => Promise<InvalidParamError>
}
