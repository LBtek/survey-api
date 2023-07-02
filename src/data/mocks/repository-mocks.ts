import { type AccountModel } from '@/domain/models/account'
import { type AddAccountParams } from '@/domain/usecases/account/add-account'
import { type SurveyModel } from '@/domain/models/survey'
import { type AddSurveyParams } from '@/domain/usecases/surveys/add-survey'
import { type SurveyResultModel } from '@/domain/models/survey-result'
import { type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { type AddAccountRepository } from '../protocols/repositories/account/add-account-repository'
import { type AddSurveyRepository } from '../protocols/repositories/survey/add-survey-repository'
import { type LoadSurveysRepository } from '../protocols/repositories/survey/load-surveys-repository'
import { type LoadSurveyByIdRepository } from '../protocols/repositories/survey/load-survey-by-id-repository'
import { type LoadAccountByEmailRepository } from '../protocols/repositories/account/load-account-by-email-repository'
import { type LoadAccountByTokenRepository } from '../protocols/repositories/account/load-account-by-token-repository'
import { type UpdateAccessTokenRepository } from '../protocols/repositories/account/update-access-token-repository'
import { type SaveSurveyResultRepository } from '../protocols/repositories/survey-result/save-survey-result-repository'
import { type LogErrorRepository } from '../protocols/repositories/log/log-error-repository'
import { mockAccount, mockSurvey, mockSurveyResult, mockSurveys } from '@/domain/models/mocks'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve((mockAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> { }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveysRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return mockAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResult()
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string, typeError: 'server' | 'auth'): Promise<void> {
      await Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}
