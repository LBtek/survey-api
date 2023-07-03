import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepositorySpy } from '@/data/mocks'
import { mockSurveyResult, mockSaveSurveyResultParams } from '@/domain/models/mocks'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy)
  return {
    sut,
    saveSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const saveSurveyResultData = mockSaveSurveyResultParams()
    await sut.save(saveSurveyResultData)
    expect(saveSurveyResultRepositorySpy.saveSurveyResultData).toEqual(saveSurveyResultData)
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResult())
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.save(mockSaveSurveyResultParams())
    await expect(promisse).rejects.toThrow()
  })
})
