import {
  type PublisherLoadSurveys,
  type PublisherAddSurvey,
  type UserLoadAllSurveys,
  type UserLoadOneSurvey,
  type GuestLoadOneSurvey
} from '@/domain/models'
import {
  type IPublisherAddSurvey as IPublisherAddSurveyUsecase,
  type IPublisherLoadSurveys as IPublisherLoadSurveysUsecase
} from '@/domain/usecases/publisher-context'
import {
  type IUserLoadOneSurvey as IUserLoadOneSurveyUsecase,
  type IUserLoadAllSurveys as IUserLoadAllSurveysUsecase
} from '@/domain/usecases/user-context'
import { mockAllSurveysToUserContext, mockSurvey, mockSurveyToGuestContext, mockSurveyToUserContext } from '../models'
import { type IGuestLoadOneSurvey as IGuestLoadOneSurveyUsecase } from '@/domain/usecases/guest-context'

export class PublisherAddSurveySpy implements IPublisherAddSurveyUsecase {
  addSurveyData: PublisherAddSurvey.Params
  result: PublisherAddSurvey.Result = 'Ok'

  async add (data: PublisherAddSurvey.Params): Promise<PublisherAddSurvey.Result> {
    this.addSurveyData = data

    return this.result
  }
}

export class PublisherLoadSurveysSpy implements IPublisherLoadSurveysUsecase {
  params: PublisherLoadSurveys.Params
  result: PublisherLoadSurveys.Result = [mockSurvey()]

  async load (data: PublisherLoadSurveys.Params): Promise<PublisherLoadSurveys.Result> {
    this.params = data
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

export class GuestLoadOneSurveySpy implements IGuestLoadOneSurveyUsecase {
  surveyId: string
  survey = mockSurveyToGuestContext()

  async load (data: GuestLoadOneSurvey.Params): Promise<GuestLoadOneSurvey.Result> {
    this.surveyId = data.surveyId
    return this.survey
  }
}
