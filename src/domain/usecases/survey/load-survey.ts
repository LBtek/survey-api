import { type SurveyModel } from '@/domain/models/survey'

export interface LoadSurvey {
  load: (surveyId: string, accountId: string) => Promise<SurveyModel>
}
