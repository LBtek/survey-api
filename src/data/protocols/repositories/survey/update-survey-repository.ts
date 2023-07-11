import { type SurveyModel } from '@/domain/models/survey'

export interface UpdateSurveyRepository {
  update: (survey: SurveyModel, oldAnswer: string, newAnswer: string) => Promise<SurveyModel>
}
