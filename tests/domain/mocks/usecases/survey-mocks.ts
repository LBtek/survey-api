import { type Survey } from '@/domain/entities'
import { type PublisherAddSurvey } from '@/domain/usecases/publisher-context'
import { type UserLoadOneSurvey, type UserLoadAllSurveys } from '@/domain/usecases/user-context'
import { mockSurvey, mockAllSurveysToUserContext } from '../models'

export class PublisherAddSurveySpy implements PublisherAddSurvey {
  addSurveyData: Survey.PublisherAddSurvey.Params
  result: Survey.PublisherAddSurvey.Result = 'Ok'

  async add (data: Survey.PublisherAddSurvey.Params): Promise<Survey.PublisherAddSurvey.Result> {
    this.addSurveyData = data

    return this.result
  }
}

export class UserLoadAllSurveysSpy implements UserLoadAllSurveys {
  surveys = mockAllSurveysToUserContext()
  accountId: string

  async load (data: Survey.UserLoadAllSurveys.Params): Promise<Survey.UserLoadAllSurveys.Result> {
    this.accountId = data.accountId
    return this.surveys
  }
}

export class UserLoadOneSurveySpy implements UserLoadOneSurvey {
  surveyId: string
  accountId: string
  survey: Survey.UserLoadOneSurvey.Result = {
    ...mockSurvey(),
    answers: mockSurvey().answers.map((answer: Survey.AnswerToUserContext) => {
      answer.isCurrentAccountAnswer = false
      return answer
    }),
    didAnswer: false
  }

  async load (data: Survey.UserLoadOneSurvey.Params): Promise<Survey.UserLoadOneSurvey.Result> {
    this.surveyId = data.surveyId
    this.accountId = data.accountId
    return this.survey
  }
}
