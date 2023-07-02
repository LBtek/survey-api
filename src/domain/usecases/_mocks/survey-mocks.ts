import { type AddSurvey, type AddSurveyParams } from '@/domain/usecases/surveys/add-survey'
import { type LoadSurveyById } from '@/domain/usecases/surveys/load-survey-by-id'
import { type LoadSurveys } from '@/domain/usecases/surveys/load-surveys'
import { type SurveyModel } from '@/domain/models/survey'
import { mockSurvey, mockSurveys } from '@/domain/models/mocks'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> { }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}
