import { type PublisherAddSurvey as PublisherAddSurveyModel } from '@/domain/models'
import { type IPublisherAddSurvey as IPublisherAddSurveyUsecase } from '@/domain/usecases/publisher-context'
import { type SurveyRepository, type IPublisherAddSurveyRepository } from '@/application/data/protocols/repositories/survey-repository'
import { AnswersLengthError, DuplicatedAnswersError } from '@/domain/errors'

export class PublisherAddSurvey implements IPublisherAddSurveyUsecase {
  constructor (private readonly publisherAddSurveyRepository: IPublisherAddSurveyRepository) {}
  async add (addSurveyData: PublisherAddSurveyModel.Params): Promise<PublisherAddSurveyModel.Result> {
    let len = addSurveyData.answers.length
    if (len < 2) {
      return new AnswersLengthError()
    }
    const answersFreq = {}
    const imagesFreq = {}
    while (len--) {
      const answer = addSurveyData.answers[len].answer.toLowerCase().trim()
      const image = addSurveyData.answers[len].image?.toLowerCase().trim()
      if (image) {
        imagesFreq[image] = (imagesFreq[image] as number || 0) + 1
      }
      answersFreq[answer] = (answersFreq[answer] as number || 0) + 1
    }
    if (
      Object.values(answersFreq).some((n: number) => n > 1) ||
      Object.values(imagesFreq).some((n: number) => n > 1)
    ) {
      return new DuplicatedAnswersError()
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
