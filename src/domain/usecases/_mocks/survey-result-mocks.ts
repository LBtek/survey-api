import { type SaveSurveyResult, type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { type SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResult } from '@/domain/models/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  saveSurveyResultData: SaveSurveyResultParams
  surveyResult = mockSurveyResult()

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultData = data
    return this.surveyResult
  }
}
