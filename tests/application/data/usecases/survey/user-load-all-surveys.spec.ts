import { UserLoadAllSurveys } from '@/application/data/usecases/survey'
import { UserLoadAllSurveysRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockAllSurveysToUserContext } from '#/domain/mocks/models'

type SutTypes = {
  sut: UserLoadAllSurveys
  loadSurveysRepositorySpy: UserLoadAllSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new UserLoadAllSurveysRepositorySpy()
  const sut = new UserLoadAllSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}
const userId = 'any_user_id'
const sutLoadParams = { userId }

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    await sut.load(sutLoadParams)
    expect(loadSurveysRepositorySpy.userId).toBe(userId)
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load(sutLoadParams)
    expect(surveys).toEqual(mockAllSurveysToUserContext())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.load(sutLoadParams)
    await expect(promisse).rejects.toThrow()
  })
})
