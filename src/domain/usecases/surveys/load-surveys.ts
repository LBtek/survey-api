import { type AllSurveys } from '../../models/survey'

export interface LoadSurveys {
  load: (accountId: string) => Promise<AllSurveys>
}
