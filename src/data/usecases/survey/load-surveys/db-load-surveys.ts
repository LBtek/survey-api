import { type LoadSurveysRepository, type LoadSurveys, type AllSurveys } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) { }

  async load (accountId: string): Promise<AllSurveys> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId)
    return surveys
  }
}
