import { GuestLoadAllSurveys } from '@/application/data/usecases/survey'
import { GuestLoadAllSurveysRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockAllSurveysToGuestContext } from '#/domain/mocks/models'

type SutTypes = {
  sut: GuestLoadAllSurveys
  loadSurveysRepositorySpy: GuestLoadAllSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new GuestLoadAllSurveysRepositorySpy()
  const sut = new GuestLoadAllSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockAllSurveysToGuestContext())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    loadSurveysRepositorySpy.guestLoadAllSurveys = () => { throw new Error() }
    const promisse = sut.load()
    await expect(promisse).rejects.toThrow()
  })
})
