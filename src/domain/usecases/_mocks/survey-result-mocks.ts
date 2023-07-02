import { type SaveSurveyResult, type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { type SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResult } from '@/domain/models/mocks'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultStub()
}
