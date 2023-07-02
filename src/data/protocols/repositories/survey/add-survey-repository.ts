import { type AddSurveyParams } from '@/domain/usecases/surveys/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
