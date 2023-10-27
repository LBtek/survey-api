import { type PublisherAddSurvey as PublisherAddSurveyModel } from '@/domain/models'
import { type IPublisherAddSurvey as IPublisherAddSurveyUsecase } from '@/domain/usecases/publisher-context'
import { type SurveyRepository, type IPublisherAddSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'
import { AnswersLengthError } from '@/domain/errors'

export class PublisherAddSurvey implements IPublisherAddSurveyUsecase {
  constructor (private readonly publisherAddSurveyRepository: IPublisherAddSurveyRepository) {}
  async add (addSurveyData: PublisherAddSurveyModel.Params): Promise<PublisherAddSurveyModel.Result> {
    if (addSurveyData.answers.length === 0) {
      return new AnswersLengthError()
    }
    const addSurveyRepositoryData: SurveyRepository.PublisherAddSurvey.Params = {
      ...addSurveyData,
      answers: addSurveyData.answers.map(answer => ({ ...answer, numberOfVotes: 0 })),
      totalNumberOfVotes: 0
    }
    await this.publisherAddSurveyRepository.add(addSurveyRepositoryData)

    return 'Ok'
  }
}
