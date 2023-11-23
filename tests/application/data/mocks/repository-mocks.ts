import { type AnswerToUserContext } from '@/domain/models'
import {
  type AccountRepository,
  type SurveyRepository,
  type SurveyVoteRepository,
  type IAddUserAccountRepository,
  type ICheckUserAccountByEmailRepository,
  type ILoadUserAccountByEmailRepository,
  type IPublisherAddSurveyRepository,
  type ISaveSurveyVoteRepository,
  type IUserUpdateSurveyRepository,
  type IUserLoadOneSurveyRepository,
  type IUserLoadAllSurveysRepository,
  type ILoadSurveyByIdRepository,
  type ILogErrorRepository,
  type LogTypeError,
  type AuthenticationRepository,
  type ILoadOwnAuthenticatedUserRepository,
  type IAuthenticateUserRepository,
  type IDeleteAccessTokenRepository,
  type IRefreshAccessTokenRepository
} from '@/application/data/protocols/repositories'
import { mockAccount, mockSurvey, mockUserLoadOneSurveyRepositoryResult, mockUserLoadAllSurveysRepositoryResult } from '#/domain/mocks/models'

export class AddAccountRepositorySpy implements IAddUserAccountRepository {
  addAccountData: AccountRepository.AddUserAccount.Params
  result: AccountRepository.AddUserAccount.Result = {
    accountId: 'any_accountId',
    userId: 'any_user_id'
  }

  async add (accountData: AccountRepository.AddUserAccount.Params): Promise<AccountRepository.AddUserAccount.Result> {
    this.addAccountData = accountData
    return this.result
  }
}

export class CheckUserAccountByEmailRepositorySpy implements ICheckUserAccountByEmailRepository {
  email: string
  result = false

  async checkByEmail (
    data: AccountRepository.CheckUserAccountByEmail.Params
  ): Promise<AccountRepository.CheckUserAccountByEmail.Result> {
    this.email = data.email
    return this.result
  }
}

export class LoadUserAccountByEmailRepositorySpy implements ILoadUserAccountByEmailRepository {
  account = mockAccount()
  email: string
  role: string

  async loadByEmail (
    data: AccountRepository.LoadUserAccountByEmail.Params
  ): Promise<AccountRepository.LoadUserAccountByEmail.Result> {
    this.email = data.email
    this.role = data.role
    return this.account
  }
}

export class LoadAuthenticatedUserRepositorySpy implements ILoadOwnAuthenticatedUserRepository {
  loadUserData: AuthenticationRepository.LoadOwnUser.Params
  account = mockAccount()

  async loadOwnUser (data: AuthenticationRepository.LoadOwnUser.Params): Promise<AuthenticationRepository.LoadOwnUser.Result> {
    this.loadUserData = data

    const { user, ...account } = this.account

    return {
      accountId: account.accountId,
      role: account.role,
      user
    }
  }
}

export class DeleteAccessTokenRepositorySpy implements IDeleteAccessTokenRepository {
  deleteAccessTokenData: AuthenticationRepository.LoadOwnUser.Params
  result = true

  async deleteAccessToken (data: AuthenticationRepository.LoadOwnUser.Params): Promise<boolean> {
    this.deleteAccessTokenData = data
    return this.result
  }
}

export class RefreshAccessTokenRepositorySpy implements IRefreshAccessTokenRepository {
  refreshTokenData: AuthenticationRepository.RefreshAccessToken.Params
  result = true

  async refreshToken (data: AuthenticationRepository.RefreshAccessToken.Params): Promise<boolean> {
    this.refreshTokenData = data
    return this.result
  }
}

export class AuthenticateUserRepositorySpy implements IAuthenticateUserRepository {
  authenticateData: AuthenticationRepository.AuthenticateUser.Params

  async authenticate (data: AuthenticationRepository.AuthenticateUser.Params): Promise<AuthenticationRepository.AuthenticateUser.Result> {
    this.authenticateData = data
  }
}

export class PublisherAddSurveyRepositorySpy implements IPublisherAddSurveyRepository {
  addSurveyData: SurveyRepository.PublisherAddSurvey.Params
  result: SurveyRepository.PublisherAddSurvey.Result = { surveyId: 'any_survey_id' }

  async add (data: SurveyRepository.PublisherAddSurvey.Params): Promise<SurveyRepository.PublisherAddSurvey.Result> {
    this.addSurveyData = data
    return this.result
  }
}

export class SaveSurveyVoteRepositorySpy implements ISaveSurveyVoteRepository {
  saveSurveyVoteData: SurveyVoteRepository.Save.Params
  oldSurveyVote: SurveyVoteRepository.Save.Result = undefined

  async save (data: SurveyVoteRepository.Save.Params): Promise<SurveyVoteRepository.Save.Result> {
    this.saveSurveyVoteData = data
    return this.oldSurveyVote
  }
}

export class UserUpdateSurveyRepositorySpy implements IUserUpdateSurveyRepository {
  oldSurvey = mockSurvey()
  newSurvey: SurveyRepository.UserUpdateSurvey.Result
  oldAnswer: string
  newAnswer: string

  async update (data: SurveyRepository.UserUpdateSurvey.Params): Promise<SurveyRepository.UserUpdateSurvey.Result> {
    const { surveyId, oldAnswer, newAnswer } = data
    this.oldSurvey.id = surveyId
    this.oldAnswer = oldAnswer
    this.newAnswer = newAnswer
    this.newSurvey = {
      ...this.oldSurvey,
      answers: this.oldSurvey.answers.map((a: AnswerToUserContext) => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (oldAnswer && answer.answer === oldAnswer) {
          answer.numberOfVotes = answer.numberOfVotes - 1
        }
        if (answer.answer === newAnswer) {
          answer.numberOfVotes = answer.numberOfVotes + 1
          answer.isCurrentAccountAnswer = true
        }
        return answer
      }),
      totalNumberOfVotes: oldAnswer ? this.oldSurvey.totalNumberOfVotes : this.oldSurvey.totalNumberOfVotes + 1,
      didAnswer: true
    }
    return this.newSurvey
  }
}

export class UserLoadOneSurveyRepositorySpy implements IUserLoadOneSurveyRepository {
  survey = mockUserLoadOneSurveyRepositoryResult()
  surveyId: string
  userId: string

  async loadSurvey (data: SurveyRepository.UserLoadOneSurvey.Params): Promise<SurveyRepository.UserLoadOneSurvey.Result> {
    this.surveyId = data.surveyId
    this.userId = data.userId
    return this.survey
  }
}

export class UserLoadAllSurveysRepositorySpy implements IUserLoadAllSurveysRepository {
  surveys = mockUserLoadAllSurveysRepositoryResult()
  userId: string

  async loadAll (data: SurveyRepository.UserLoadAllSurveys.Params): Promise<SurveyRepository.UserLoadAllSurveys.Result> {
    this.userId = data.userId
    return this.surveys
  }
}

export class LoadSurveyByIdRepositorySpy implements ILoadSurveyByIdRepository {
  surveyId: string
  surveyResult: SurveyRepository.LoadSurveyById.Result = mockSurvey()

  async loadById (data: SurveyRepository.LoadSurveyById.Params): Promise<SurveyRepository.LoadSurveyById.Result> {
    this.surveyId = data.id
    return this.surveyResult
  }
}

export class LogErrorRepositorySpy implements ILogErrorRepository {
  stack: string
  typeError: LogTypeError

  async logError (stack: string, typeError: LogTypeError): Promise<void> {
    this.stack = stack
    this.typeError = typeError
  }
}
