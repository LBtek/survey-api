import { type AllSurveys } from '@/domain/models/survey'

export interface LoadSurveysRepository {
  loadAll: (accountId: string) => Promise<AllSurveys>
}
