import { type AddSurvey } from '@/domain/usecases/survey/add-survey'
import { type LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { type SurveyModel, type AddSurveyParams } from '@/domain/models/survey'
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

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return this.surveys
  }
}
