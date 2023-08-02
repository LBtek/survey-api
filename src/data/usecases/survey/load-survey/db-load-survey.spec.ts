import { DbLoadSurvey } from './db-load-survey'
import { LoadSurveyRepositorySpy } from '@/data/mocks'
import { mockSurvey } from '@/domain/models/mocks'

type SutTypes = {
  sut: DbLoadSurvey
  loadSurveyRepositorySpy: LoadSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositorySpy = new LoadSurveyRepositorySpy()
  const sut = new DbLoadSurvey(loadSurveyRepositorySpy)
  return {
    sut,
    loadSurveyRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    const accountId = 'any_account_id'
    const surveyId = 'any_survey_id'
    await sut.load(surveyId, accountId)
    expect(loadSurveyRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyRepositorySpy.accountId).toBe(accountId)
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.load('any_survey_id', 'any_account_id')
    expect(survey).toEqual(mockSurvey())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveyRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyRepositorySpy, 'loadSurvey').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.load('any_survey_id', 'any_account_id')
    await expect(promisse).rejects.toThrow()
  })
})
