import { PublisherLoadSurveys } from '@/application/data/usecases/survey'
import { PulisherLoadSurveysRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockSurveyToPublisherContext } from '#/domain/mocks/models'

type SutTypes = {
  sut: PublisherLoadSurveys
  pulisherLoadSurveysRepositorySpy: PulisherLoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const pulisherLoadSurveysRepositorySpy = new PulisherLoadSurveysRepositorySpy()
  const sut = new PublisherLoadSurveys(pulisherLoadSurveysRepositorySpy)
  return {
    sut,
    pulisherLoadSurveysRepositorySpy
  }
}

const sutLoadParams = { publisherAccountId: 'any_account_id' }

describe('LoadSurveys', () => {
  test('Should call PublisherLoadSurveysRepository', async () => {
    const { sut, pulisherLoadSurveysRepositorySpy } = makeSut()
    await sut.load(sutLoadParams)
    expect(pulisherLoadSurveysRepositorySpy.params).toEqual(sutLoadParams)
  })

  test('Should return surveys on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.load(sutLoadParams)
    expect(survey).toEqual([mockSurveyToPublisherContext()])
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, pulisherLoadSurveysRepositorySpy } = makeSut()
    pulisherLoadSurveysRepositorySpy.publisherLoadSurveys = () => { throw new Error() }
    const promisse = sut.load(sutLoadParams)
    await expect(promisse).rejects.toThrow()
  })
})
