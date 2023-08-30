import { DbUserLoadOneSurvey } from '@/application/data/usecases/survey'
import { UserLoadOneSurveyRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockSurveyToUserContext } from '#/domain/mocks/models'

type SutTypes = {
  sut: DbUserLoadOneSurvey
  loadSurveyRepositorySpy: UserLoadOneSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositorySpy = new UserLoadOneSurveyRepositorySpy()
  const sut = new DbUserLoadOneSurvey(loadSurveyRepositorySpy)
  return {
    sut,
    loadSurveyRepositorySpy
  }
}
const surveyId = 'any_survey_id'
const userId = 'any_user_id'
const sutLoadParams = { surveyId, userId }

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    await sut.load(sutLoadParams)
    expect(loadSurveyRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyRepositorySpy.userId).toBe(userId)
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.load(sutLoadParams)
    expect(survey).toEqual(mockSurveyToUserContext())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyRepositorySpy, 'loadSurvey').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.load(sutLoadParams)
    await expect(promisse).rejects.toThrow()
  })
})
