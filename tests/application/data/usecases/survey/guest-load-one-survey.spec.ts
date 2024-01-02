import { GuestLoadOneSurvey } from '@/application/data/usecases/survey'
import { LoadSurveyByIdRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockSurveyToGuestContext } from '#/domain/mocks/models'

type SutTypes = {
  sut: GuestLoadOneSurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new GuestLoadOneSurvey(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}
const surveyId = 'any_survey_id'
const sutLoadParams = { surveyId }

describe('GuestLoadOneSurvey Usecase', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.load(sutLoadParams)
    expect(loadSurveyByIdRepositorySpy.surveyId).toBe(surveyId)
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.load(sutLoadParams)
    const result = mockSurveyToGuestContext()
    expect(survey).toEqual(result)
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.loadById = () => { throw new Error() }
    const promisse = sut.load(sutLoadParams)
    await expect(promisse).rejects.toThrow()
  })
})
