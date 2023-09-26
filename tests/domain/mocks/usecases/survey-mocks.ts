import {
  type PublisherAddSurvey,
  type UserLoadAllSurveys,
  type UserLoadOneSurvey
} from '@/domain/models'
import { type IPublisherAddSurvey as IPublisherAddSurveyUsecase } from '@/domain/usecases/publisher-context'
import {
  type IUserLoadOneSurvey as IUserLoadOneSurveyUsecase,
  type IUserLoadAllSurveys as IUserLoadAllSurveysUsecase
} from '@/domain/usecases/user-context'
import { mockAllSurveysToUserContext, mockSurveyToUserContext } from '../models'

export class PublisherAddSurveySpy implements IPublisherAddSurveyUsecase {
  addSurveyData: PublisherAddSurvey.Params
  result: PublisherAddSurvey.Result = 'Ok'

  async add (data: PublisherAddSurvey.Params): Promise<PublisherAddSurvey.Result> {
    this.addSurveyData = data

    return this.result
  }
}

export class UserLoadAllSurveysSpy implements IUserLoadAllSurveysUsecase {
  surveys = mockAllSurveysToUserContext()
  userId: string

  async load (data: UserLoadAllSurveys.Params): Promise<UserLoadAllSurveys.Result> {
    this.userId = data.userId
    return this.surveys
  }
}

export class UserLoadOneSurveySpy implements IUserLoadOneSurveyUsecase {
  surveyId: string
  userId: string
  survey = mockSurveyToUserContext()

  async load (data: UserLoadOneSurvey.Params): Promise<UserLoadOneSurvey.Result> {
    this.surveyId = data.surveyId
    this.userId = data.userId
    return this.survey
  }
}
