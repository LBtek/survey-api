import { type SurveyRepository, type PublisherAddSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'
import { type Survey } from '@/domain/entities'
import { type PublisherAddSurvey } from '@/domain/usecases/publisher-context'
import { AnswersLengthError } from '@/domain/errors'

export class DbPublisherAddSurvey implements PublisherAddSurvey {
  constructor (private readonly publisherAddSurveyRepository: PublisherAddSurveyRepository) {}
  async add (addSurveyData: Survey.PublisherAddSurvey.Params): Promise<Survey.PublisherAddSurvey.Result> {
    if (addSurveyData.answers.length === 0) {
      return new AnswersLengthError()
    }
    const addSurveyRepositoryData: SurveyRepository.PublisherAddSurvey.Params = {
      ...addSurveyData,
      answers: addSurveyData.answers.map(answer => ({ ...answer, amountVotes: 0 })),
      totalAmountVotes: 0
    }
    await this.publisherAddSurveyRepository.add(addSurveyRepositoryData)

    return 'Ok'
  }
}
