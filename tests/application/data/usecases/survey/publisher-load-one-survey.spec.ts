import { PublisherLoadOneSurvey } from '@/application/data/usecases/survey'
import { LoadSurveyByIdRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockSurveyToPublisherContext } from '#/domain/mocks/models'

type SutTypes = {
  sut: PublisherLoadOneSurvey
  loadSurveyRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new PublisherLoadOneSurvey(loadSurveyRepositorySpy)
  return {
    sut,
    loadSurveyRepositorySpy
  }
}
const surveyId = 'any_survey_id'
const publisherAccountId = 'any_account_id'
const sutLoadParams = { surveyId, publisherAccountId }

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveyByIdRepository with correct surveyId', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    await sut.load(sutLoadParams)
    expect(loadSurveyRepositorySpy.surveyId).toBe(surveyId)
  })

  test('Should not return anything if publisherAccountId is not compatible', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    loadSurveyRepositorySpy.surveyResult.publisherAccountId = 'other_account_id'
    const survey = await sut.load(sutLoadParams)
    expect(survey).toBeFalsy()
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.load(sutLoadParams)
    expect(survey).toEqual(mockSurveyToPublisherContext())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    loadSurveyRepositorySpy.loadById = () => { throw new Error() }
    const promisse = sut.load(sutLoadParams)
    await expect(promisse).rejects.toThrow()
  })
})
