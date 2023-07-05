import { DbAddSurvey } from './db-add-survey'
import { mockAddSurveyParams, mockAddSurveyRepositoryParams } from '@/domain/models/mocks'
import { AddSurveyRepositorySpy } from '@/data/mocks'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)
  return {
    sut,
    addSurveyRepositorySpy
  }
}

describe('DbAddSurvey UseCase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    await sut.add(mockAddSurveyParams())
    expect(addSurveyRepositorySpy.addSurveyData).toEqual(mockAddSurveyRepositoryParams())
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    jest.spyOn(addSurveyRepositorySpy, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.add(mockAddSurveyParams())
    await expect(promisse).rejects.toThrow()
  })
})
