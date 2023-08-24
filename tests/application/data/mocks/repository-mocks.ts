import { type AnswerToUserContext } from '@/domain/models'
import {
  type AccountRepository,
  type SurveyRepository,
  type SurveyVoteRepository,
  type AddUserAccountRepository,
  type CheckUserAccountByEmailRepository,
  type LoadUserAccountByEmailRepository,
  type LoadUserAccountByTokenRepository,
  type UpdateAccessTokenRepository,
  type PublisherAddSurveyRepository,
  type SaveSurveyVoteRepository,
  type UserUpdateSurveyRepository,
  type UserLoadOneSurveyRepository,
  type UserLoadAllSurveysRepository,
  type LoadSurveyByIdRepository,
  type LogErrorRepository,
  type LogTypeError
} from '@/application/data/protocols/repositories'
import { mockAccount, mockSurvey, mockUserLoadOneSurveyRepositoryResult, mockUserLoadAllSurveysRepositoryResult } from '#/domain/mocks/models'

export class AddAccountRepositorySpy implements AddUserAccountRepository {
  addAccountData: AccountRepository.AddUserAccount.Params
  response: AccountRepository.AddUserAccount.Result = {
    accountId: 'any_accountId',
    userId: 'any_user_id'
  }

  async add (accountData: AccountRepository.AddUserAccount.Params): Promise<AccountRepository.AddUserAccount.Result> {
    this.addAccountData = accountData
    return this.response
  }
}

export class CheckUserAccountByEmailRepositorySpy implements CheckUserAccountByEmailRepository {
  email: string
  result = false

  async checkByEmail (
    data: AccountRepository.CheckUserAccountByEmail.Params
  ): Promise<AccountRepository.CheckUserAccountByEmail.Result> {
    this.email = data.email
    return this.result
  }
}

export class LoadUserAccountByEmailRepositorySpy implements LoadUserAccountByEmailRepository {
  account = mockAccount()
  email: string

  async loadByEmail (
    data: AccountRepository.LoadUserAccountByEmail.Params
  ): Promise<AccountRepository.LoadUserAccountByEmail.Result> {
    this.email = data.email
    return this.account
  }
}

export class LoadUserAccountByTokenRepositorySpy implements LoadUserAccountByTokenRepository {
  token: string
  role: string
  account = mockAccount()

  async loadByToken (data: AccountRepository.LoadUserAccountByToken.Params): Promise<AccountRepository.LoadUserAccountByToken.Result> {
    this.token = data.accessToken
    this.role = data.role
    const { user, ...account } = this.account
    return {
      accountId: account.accountId,
      ...user
    }
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (data: AccountRepository.UpdateAccessToken.Params): Promise<AccountRepository.UpdateAccessToken.Result> {
    this.id = data.accountId
    this.token = data.accessToken
  }
}

export class PublisherAddSurveyRepositorySpy implements PublisherAddSurveyRepository {
  addSurveyData: SurveyRepository.PublisherAddSurvey.Params
  result: SurveyRepository.PublisherAddSurvey.Result = { surveyId: 'any_survey_id' }

  async add (data: SurveyRepository.PublisherAddSurvey.Params): Promise<SurveyRepository.PublisherAddSurvey.Result> {
    this.addSurveyData = data
    return this.result
  }
}

export class SaveSurveyVoteRepositorySpy implements SaveSurveyVoteRepository {
  saveSurveyVoteData: SurveyVoteRepository.Save.Params
  oldSurveyVote: SurveyVoteRepository.Save.Result = undefined

  async save (data: SurveyVoteRepository.Save.Params): Promise<SurveyVoteRepository.Save.Result> {
    this.saveSurveyVoteData = data
    return this.oldSurveyVote
  }
}

export class UserUpdateSurveyRepositorySpy implements UserUpdateSurveyRepository {
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
          answer.amountVotes = answer.amountVotes - 1
        }
        if (answer.answer === newAnswer) {
          answer.amountVotes = answer.amountVotes + 1
          answer.isCurrentAccountAnswer = true
        }
        return answer
      }),
      totalAmountVotes: oldAnswer ? this.oldSurvey.totalAmountVotes : this.oldSurvey.totalAmountVotes + 1,
      didAnswer: true
    }
    return this.newSurvey
  }
}

export class UserLoadOneSurveyRepositorySpy implements UserLoadOneSurveyRepository {
  survey = mockUserLoadOneSurveyRepositoryResult()
  surveyId: string
  accountId: string

  async loadSurvey (data: SurveyRepository.UserLoadOneSurvey.Params): Promise<SurveyRepository.UserLoadOneSurvey.Result> {
    this.surveyId = data.surveyId
    this.accountId = data.accountId
    return this.survey
  }
}

export class UserLoadAllSurveysRepositorySpy implements UserLoadAllSurveysRepository {
  surveys = mockUserLoadAllSurveysRepositoryResult()
  accountId: string

  async loadAll (data: SurveyRepository.UserLoadAllSurveys.Params): Promise<SurveyRepository.UserLoadAllSurveys.Result> {
    this.accountId = data.accountId
    return this.surveys
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyId: string
  surveyResult: SurveyRepository.LoadSurveyById.Result = mockSurvey()

  async loadById (data: SurveyRepository.LoadSurveyById.Params): Promise<SurveyRepository.LoadSurveyById.Result> {
    this.surveyId = data.id
    return this.surveyResult
  }
}

export class LogErrorRepositorySpy implements LogErrorRepository {
  stack: string
  typeError: LogTypeError

  async logError (stack: string, typeError: LogTypeError): Promise<void> {
    this.stack = stack
    this.typeError = typeError
  }
}
