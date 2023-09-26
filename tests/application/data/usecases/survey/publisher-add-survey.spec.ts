import { PublisherAddSurvey } from '@/application/data/usecases/survey'
import { PublisherAddSurveyRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockAddSurveyParams, mockAddSurveyRepositoryParams } from '#/domain/mocks/models'
import { AnswersLengthError } from '@/domain/errors'

type SutTypes = {
  sut: PublisherAddSurvey
  publisherAddSurveyRepositorySpy: PublisherAddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const publisherAddSurveyRepositorySpy = new PublisherAddSurveyRepositorySpy()
  const sut = new PublisherAddSurvey(publisherAddSurveyRepositorySpy)
  return {
    sut,
    publisherAddSurveyRepositorySpy
  }
}

describe('PublisherAddSurvey UseCase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, publisherAddSurveyRepositorySpy } = makeSut()
    await sut.add(mockAddSurveyParams())
    expect(publisherAddSurveyRepositorySpy.addSurveyData).toEqual(mockAddSurveyRepositoryParams())
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, publisherAddSurveyRepositorySpy } = makeSut()
    jest.spyOn(publisherAddSurveyRepositorySpy, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.add(mockAddSurveyParams())
    await expect(promisse).rejects.toThrow()
  })

  test('Should return an AnswersLengthError if answers is an empty array', async () => {
    const { sut } = makeSut()
    const surveyToAdd = mockAddSurveyParams()
    surveyToAdd.answers = []
    const result = await sut.add(surveyToAdd)
    expect(result).toEqual(new AnswersLengthError())
  })
})
