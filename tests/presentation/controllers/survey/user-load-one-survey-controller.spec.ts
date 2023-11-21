import { type UserLoadOneSurvey } from '@/domain/models'
import { InvalidParamError } from '@/presentation/errors'
import { UserLoadOneSurveyController } from '@/presentation/controllers'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { ValidationSpy } from '#/presentation/_mocks'
import { UserLoadOneSurveySpy } from '#/domain/mocks/usecases'
import { mockSurveyToUserContext } from '#/domain/mocks/models'
import MockDate from 'mockdate'

const mockRequest = (): UserLoadOneSurvey.Params => ({
  userId: 'any_user_id',
  surveyId: 'any_survey_id'
})

type SutTypes = {
  sut: UserLoadOneSurveyController
  validationSpy: ValidationSpy
  loadSurveySpy: UserLoadOneSurveySpy
}

const makeSut = (): SutTypes => {
  const loadSurveySpy = new UserLoadOneSurveySpy()
  const validationSpy = new ValidationSpy()
  const sut = new UserLoadOneSurveyController(loadSurveySpy, validationSpy)
  return {
    sut,
    loadSurveySpy,
    validationSpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toBe(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new InvalidParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('any_field')))
  })

  test('Should call LoadSurvey with correct values', async () => {
    const { sut, loadSurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveySpy.surveyId).toBe(request.surveyId)
    expect(loadSurveySpy.userId).toBe(request.userId)
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
