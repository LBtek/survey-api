import { type LoadSurveyByIdRepository } from '../protocols/repositories'
import { type SurveyModel } from '@/domain/models/survey'
import { mockSurvey } from '@/domain/models/mocks'

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  survey = mockSurvey()
  id: string

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.survey
  }
}
