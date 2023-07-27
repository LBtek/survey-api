import { type AddSurvey } from '@/domain/usecases/surveys/add-survey'
import { type LoadSurveyById } from '@/domain/usecases/surveys/load-survey-by-id'
import { type LoadSurveys } from '@/domain/usecases/surveys/load-surveys'
import { type AllSurveys, type AddSurveyParams, type SurveyModel } from '@/domain/models/survey'
import { mockSurvey, mockSurveys } from '@/domain/models/mocks'

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

export class LoadSurveyByIdSpy implements LoadSurveyById {
  id: string
  survey = mockSurvey()

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.survey
  }
}
