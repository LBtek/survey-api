import { type HttpRequest } from './load-survey-controller-protocols'
import { LoadSurveyController } from './load-survey-controller'
import { mockSurvey } from '@/domain/models/mocks'
import { LoadSurveySpy } from '@/domain/usecases/_mocks'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'

const mockHttpRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  params: { surveyId: 'any_survey_id' }
})

type SutTypes = {
  sut: LoadSurveyController
  loadSurveySpy: LoadSurveySpy
}

const makeSut = (): SutTypes => {
  const loadSurveySpy = new LoadSurveySpy()
  const sut = new LoadSurveyController(loadSurveySpy)
  return {
    sut,
    loadSurveySpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurvey with correct values', async () => {
    const { sut, loadSurveySpy } = makeSut()
    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(loadSurveySpy.surveyId).toBe(httpRequest.params.surveyId)
    expect(loadSurveySpy.accountId).toBe(httpRequest.accountId)
  })

  test('Should return 403 if survey is not found ', async () => {
    const { sut, loadSurveySpy } = makeSut()
    loadSurveySpy.survey = null
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok(mockSurvey()))
  })

  test('Should return 500 if LoadSurvey trows', async () => {
    const { sut, loadSurveySpy } = makeSut()
    jest.spyOn(loadSurveySpy, 'load').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
