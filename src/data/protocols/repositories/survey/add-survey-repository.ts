import { type SurveyModel } from '@/domain/models/survey'

export type AddSurveyRepositoryParams = Omit<SurveyModel, 'id'>

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyRepositoryParams) => Promise<void>
}
