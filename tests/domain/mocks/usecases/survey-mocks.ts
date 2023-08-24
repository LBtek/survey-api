import {
  type PublisherAddSurvey,
  type UserLoadAllSurveys,
  type UserLoadOneSurvey
} from '@/domain/models'
import { type PublisherAddSurvey as PublisherAddSurveyUsecase } from '@/domain/usecases/publisher-context'
import {
  type UserLoadOneSurvey as UserLoadOneSurveyUsecase,
  type UserLoadAllSurveys as UserLoadAllSurveysUsecase
} from '@/domain/usecases/user-context'
import { mockAllSurveysToUserContext, mockSurveyToUserContext } from '../models'

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
  survey = mockSurveyToUserContext()

  async load (data: UserLoadOneSurvey.Params): Promise<UserLoadOneSurvey.Result> {
    this.surveyId = data.surveyId
    this.accountId = data.accountId
    return this.survey
  }
}
