import { type AddSurvey } from '@/domain/usecases/surveys/add-survey'
import { type LoadSurveys } from '@/domain/usecases/surveys/load-surveys'
import { type AllSurveys, type AddSurveyParams } from '@/domain/models/survey'
import { mockSurveys } from '@/domain/models/mocks'

export class AddSurveySpy implements AddSurvey {
  addSurveyData: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyData = data
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveys = mockSurveys()
  accountId: string

  async load (accountId: string): Promise<AllSurveys> {
    this.accountId = accountId
    return this.surveys
  }
}
