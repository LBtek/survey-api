import { PublisherLoadSurveysController } from '@/presentation/controllers'
import { PublisherLoadSurveysSpy } from '#/domain/mocks/usecases'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

const mockRequest = (): any => ({ accountId: 'any_account_id' })

type SutTypes = {
  sut: PublisherLoadSurveysController
  loadSurveysSpy: PublisherLoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new PublisherLoadSurveysSpy()
  const sut = new PublisherLoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  test('Should call LoadSurveys with correct publisherAccountId', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveysSpy.params.publisherAccountId).toBe(httpRequest.accountId)
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(loadSurveysSpy.result))
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
