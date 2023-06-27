import { type SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { type SurveyResultModel } from '../survey-result'

const date = new Date()

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date
})

export const mockSurveyResult = (): SurveyResultModel => ({
  id: 'any_survey_result_id',
  ...mockSaveSurveyResultParams()
})
