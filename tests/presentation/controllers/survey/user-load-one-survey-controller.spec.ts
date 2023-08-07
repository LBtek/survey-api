import { type Survey } from '@/domain/entities'
import { UserLoadOneSurveyController } from '@/presentation/controllers'
import { UserLoadOneSurveySpy } from '#/domain/mocks/usecases'
import { mockSurveyToUserContext } from '#/domain/mocks/models'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'

const mockRequest = (): Survey.UserLoadOneSurvey.Params => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id'
})

type SutTypes = {
  sut: UserLoadOneSurveyController
  loadSurveySpy: UserLoadOneSurveySpy
}

const makeSut = (): SutTypes => {
  const loadSurveySpy = new UserLoadOneSurveySpy()
  const sut = new UserLoadOneSurveyController(loadSurveySpy)
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
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveySpy.surveyId).toBe(request.surveyId)
    expect(loadSurveySpy.accountId).toBe(request.accountId)
  })

  test('Should return 403 if survey is not found ', async () => {
    const { sut, loadSurveySpy } = makeSut()
    loadSurveySpy.survey = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyToUserContext()))
  })

  test('Should return 500 if LoadSurvey trows', async () => {
    const { sut, loadSurveySpy } = makeSut()
    jest.spyOn(loadSurveySpy, 'load').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
