import { type AddSurveyRepository, type AddSurvey, type AddSurveyParams, type AddSurveyRepositoryParams } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}
  async add (addSurveyData: AddSurveyParams): Promise<void> {
    const addSurveyRepositoryData: AddSurveyRepositoryParams = {
      ...addSurveyData,
      answers: addSurveyData.answers.map(answer => ({ ...answer, amountVotes: 0, percent: 0 })),
      totalAmountVotes: 0
    }
    await this.addSurveyRepository.add(addSurveyRepositoryData)
  }
}
