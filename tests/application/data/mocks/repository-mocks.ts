import { type AnswerToUserContext } from '@/domain/models'
import {
  type AccountRepository,
  type SurveyRepository,
  type UserSurveyVoteRepository,
  type IAddUserAccountRepository,
  type ICheckUserAccountByEmailRepository,
  type ILoadUserAccountByEmailRepository,
  type IPublisherAddSurveyRepository,
  type IUserSaveSurveyVoteRepository,
  type IUserUpdateSurveyRepository,
  type ILoadOneSurveyRepository,
  type IUserLoadAllSurveysRepository,
  type ILoadSurveyByIdRepository,
  type ILogErrorRepository,
  type LogTypeError,
  type AuthenticationRepository,
  type ILoadOwnAuthenticatedUserRepository,
  type IAuthenticateUserRepository,
  type IDeleteAccessTokenRepository,
  type IRefreshAccessTokenRepository,
  type ILoadGuestsByAgentIdRepository,
  type GuestRepository,
  type ISaveGuestRepository,
  type IGuestSaveSurveyVoteRepository,
  type GuestSurveyVoteRepository
} from '@/application/data/protocols/repositories'
import { mockAccount, mockSurvey, mockLoadOneSurveyRepositoryResult, mockUserLoadAllSurveysRepositoryResult, mockLoadGuestsByAgentId, mockGuest } from '#/domain/mocks/models'

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

export class UserSaveSurveyVoteRepositorySpy implements IUserSaveSurveyVoteRepository {
  saveSurveyVoteData: UserSurveyVoteRepository.UserSaveVote.Params
  oldSurveyVote: UserSurveyVoteRepository.UserSaveVote.Result = undefined

  async userSaveVote (data: UserSurveyVoteRepository.UserSaveVote.Params): Promise<UserSurveyVoteRepository.UserSaveVote.Result> {
    this.saveSurveyVoteData = data
    return this.oldSurveyVote
  }
}

export class UpdateSurveyRepositorySpy implements IUserUpdateSurveyRepository {
  oldSurvey = mockSurvey()
  newSurvey: SurveyRepository.UpdateSurvey.Result
  oldAnswer: string
  newAnswer: string

  async update (data: SurveyRepository.UpdateSurvey.Params): Promise<SurveyRepository.UpdateSurvey.Result> {
    const { surveyId, oldAnswer, newAnswer } = data
    this.oldSurvey.id = surveyId
    this.oldAnswer = oldAnswer
    this.newAnswer = newAnswer
    const isUser = data.type === 'user'
    this.newSurvey = {
      ...this.oldSurvey,
      answers: this.oldSurvey.answers.map((a: AnswerToUserContext) => {
        const answer = { ...a }
        if (isUser) answer.isCurrentAccountAnswer = false
        if (oldAnswer && answer.answer === oldAnswer) {
          answer.numberOfVotes = answer.numberOfVotes - 1
        }
        if (answer.answer === newAnswer) {
          answer.numberOfVotes = answer.numberOfVotes + 1
          if (isUser) answer.isCurrentAccountAnswer = true
        }
        return answer
      }),
      totalNumberOfVotes: oldAnswer ? this.oldSurvey.totalNumberOfVotes : this.oldSurvey.totalNumberOfVotes + 1
    }
    if (isUser) this.newSurvey.didAnswer = true
    return this.newSurvey
  }
}

export class LoadOneSurveyRepositorySpy implements ILoadOneSurveyRepository {
  survey: SurveyRepository.LoadOneSurvey.Result
  surveyId: string
  userId: string
  guestId: string

  async loadSurvey (data: SurveyRepository.LoadOneSurvey.Params): Promise<SurveyRepository.LoadOneSurvey.Result> {
    this.surveyId = data.surveyId
    this.userId = data.type === 'user' ? data.userOrGuestId : null
    this.guestId = data.type === 'guest' ? data.userOrGuestId : null
    this.survey = mockLoadOneSurveyRepositoryResult(data.type)
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

export class LoadGuestsByAgentIdRepositorySpy implements ILoadGuestsByAgentIdRepository {
  loadDataParams: GuestRepository.LoadGuestsByAgentId.Params
  guests = mockLoadGuestsByAgentId()

  async loadByAgentId (data: GuestRepository.LoadGuestsByAgentId.Params): Promise<GuestRepository.LoadGuestsByAgentId.Result> {
    this.loadDataParams = data

    return this.guests
  }
}

export class SaveGuestRepositorySpy implements ISaveGuestRepository {
  saveDataParams: GuestRepository.SaveGuest.Params
  saveResult = mockGuest()

  async save (data: GuestRepository.SaveGuest.Params): Promise<GuestRepository.SaveGuest.Result> {
    this.saveDataParams = data

    return this.saveResult
  }
}

export class GuestSaveSurveyVoteRepositorySpy implements IGuestSaveSurveyVoteRepository {
  saveSurveyVoteData: GuestSurveyVoteRepository.GuestSaveVote.Params
  oldSurveyVote: GuestSurveyVoteRepository.GuestSaveVote.Result = undefined

  async guestSaveVote (data: GuestSurveyVoteRepository.GuestSaveVote.Params): Promise<GuestSurveyVoteRepository.GuestSaveVote.Result> {
    this.saveSurveyVoteData = data
    return this.oldSurveyVote
  }
}
