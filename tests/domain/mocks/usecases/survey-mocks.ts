import {
  type PublisherAddSurvey,
  type UserLoadAllSurveys,
  type UserLoadOneSurvey,
  type AnswerToUserContext
} from '@/domain/models'
import { type PublisherAddSurvey as PublisherAddSurveyUsecase } from '@/domain/usecases/publisher-context'
import {
  type UserLoadOneSurvey as UserLoadOneSurveyUsecase,
  type UserLoadAllSurveys as UserLoadAllSurveysUsecase
} from '@/domain/usecases/user-context'
import { mockSurvey, mockAllSurveysToUserContext } from '../models'

export class PublisherAddSurveySpy implements PublisherAddSurveyUsecase {
  addSurveyData: PublisherAddSurvey.Params
  result: PublisherAddSurvey.Result = 'Ok'

  async add (data: PublisherAddSurvey.Params): Promise<PublisherAddSurvey.Result> {
    this.addSurveyData = data

    return this.result
  }
}

export class UserLoadAllSurveysSpy implements UserLoadAllSurveysUsecase {
  surveys = mockAllSurveysToUserContext()
  accountId: string

  async load (data: UserLoadAllSurveys.Params): Promise<UserLoadAllSurveys.Result> {
    this.accountId = data.accountId
    return this.surveys
  }
}

export class UserLoadOneSurveySpy implements UserLoadOneSurveyUsecase {
  surveyId: string
  accountId: string
  survey: UserLoadOneSurvey.Result = {
    ...mockSurvey(),
    answers: mockSurvey().answers.map((answer: AnswerToUserContext) => {
      answer.isCurrentAccountAnswer = false
      return answer
    }),
    didAnswer: false
  }

  async load (data: UserLoadOneSurvey.Params): Promise<UserLoadOneSurvey.Result> {
    this.surveyId = data.surveyId
    this.accountId = data.accountId
    return this.survey
  }
}
