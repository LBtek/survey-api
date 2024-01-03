import { type UserLoadAllSurveys } from '@/domain/models'
import { UserLoadAllSurveysController } from '@/presentation/controllers'
import { UserLoadAllSurveysSpy } from '#/domain/mocks/usecases'
import { mockAllSurveysToUserContext } from '#/domain/mocks/models'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

const mockRequest = (): UserLoadAllSurveys.Params => ({ userId: 'any_user_id' })

type SutTypes = {
  sut: UserLoadAllSurveysController
  loadSurveysSpy: UserLoadAllSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new UserLoadAllSurveysSpy()
  const sut = new UserLoadAllSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  test('Should call LoadSurveys with correct userId', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveysSpy.userId).toBe(httpRequest.userId)
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(mockAllSurveysToUserContext()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockReturnValueOnce(
      Promise.resolve([])
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys trows', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
