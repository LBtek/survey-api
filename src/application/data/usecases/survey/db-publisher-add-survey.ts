import { type PublisherAddSurvey } from '@/domain/models'
import { type PublisherAddSurvey as PublisherAddSurveyUsecase } from '@/domain/usecases/publisher-context'
import { type SurveyRepository, type PublisherAddSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'
import { AnswersLengthError } from '@/domain/errors'

export class DbPublisherAddSurvey implements PublisherAddSurveyUsecase {
  constructor (private readonly publisherAddSurveyRepository: PublisherAddSurveyRepository) {}
  async add (addSurveyData: PublisherAddSurvey.Params): Promise<PublisherAddSurvey.Result> {
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
