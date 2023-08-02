import { type LoadSurveyRepository, type LoadSurvey, type SurveyModel } from './db-load-survey-protocols'

export class DbLoadSurvey implements LoadSurvey {
  constructor (private readonly loadSurveyRepository: LoadSurveyRepository) { }

  async load (surveyId: string, accountId: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyRepository.loadSurvey(surveyId, accountId)
    return survey
  }
}
