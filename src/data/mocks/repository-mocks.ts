import { type AccountModel } from '@/domain/models/account'
import { type AddAccountParams } from '@/domain/usecases/account/add-account'
import { type SurveyModel } from '@/domain/models/survey'
import { type SurveyResultModel } from '@/domain/models/survey-result'
import { type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { type AddAccountRepository } from '../protocols/repositories/account/add-account-repository'
import { type AddSurveyRepositoryParams, type AddSurveyRepository } from '../protocols/repositories/survey/add-survey-repository'
import { type LoadSurveysRepository } from '../protocols/repositories/survey/load-surveys-repository'
import { type LoadSurveyByIdRepository } from '../protocols/repositories/survey/load-survey-by-id-repository'
import { type LoadAccountByEmailRepository } from '../protocols/repositories/account/load-account-by-email-repository'
import { type LoadAccountByTokenRepository } from '../protocols/repositories/account/load-account-by-token-repository'
import { type UpdateAccessTokenRepository } from '../protocols/repositories/account/update-access-token-repository'
import { type SaveSurveyResultRepository } from '../protocols/repositories/survey-result/save-survey-result-repository'
import { type LogErrorRepository } from '../protocols/repositories/log/log-error-repository'
import { mockAccount, mockSurvey, mockSurveyResult, mockSurveys } from '@/domain/models/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  addAccountData: AddAccountParams
  account = mockAccount()

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    this.addAccountData = accountData
    return this.account
  }
}

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyData: AddSurveyRepositoryParams

  async add (surveyData: AddSurveyRepositoryParams): Promise<void> {
    this.addSurveyData = surveyData
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  survey = mockSurvey()
  id: string

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.survey
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveys = mockSurveys()

  async loadAll (): Promise<SurveyModel[]> {
    return this.surveys
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  account = mockAccount()
  email: string

  async loadByEmail (email: string): Promise<AccountModel | null> {
    this.email = email
    return this.account
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token: string
  role: string
  account = mockAccount()

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    this.token = token
    this.role = role
    return this.account
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultData: SaveSurveyResultParams
  surveyResult = mockSurveyResult()

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultData = data
    return this.surveyResult
  }
}

export class LogErrorRepositorySpy implements LogErrorRepository {
  stack: string
  typeError: 'server' | 'auth'

  async logError (stack: string, typeError: 'server' | 'auth'): Promise<void> {
    this.stack = stack
    this.typeError = typeError
  }
}
