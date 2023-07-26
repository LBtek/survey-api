import { type SurveyModel } from '@/domain/models/survey'

export interface UpdateSurveyRepository {
  update: (surveyId: string, oldAnswer: string, newAnswer: string) => Promise<SurveyModel>
}
