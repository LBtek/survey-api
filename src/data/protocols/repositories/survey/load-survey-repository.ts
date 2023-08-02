import { type SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyRepository {
  loadSurvey: (surveyId: string, accountId: string) => Promise<SurveyModel>
}
