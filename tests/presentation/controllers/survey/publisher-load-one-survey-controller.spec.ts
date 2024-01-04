import { type SurveyID } from '@/domain/entities'
import { type AccountID } from '@/application/entities'
import { InvalidParamError } from '@/presentation/errors'
import { PublisherLoadOneSurveyController } from '@/presentation/controllers'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { ValidationSpy } from '#/presentation/_mocks'
import { PublisherLoadOneSurveySpy } from '#/domain/mocks/usecases'
import { mockSurveyToPublisherContext } from '#/domain/mocks/models'

const mockRequest = (): { accountId: AccountID, surveyId: SurveyID } => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id'
})

type SutTypes = {
  sut: PublisherLoadOneSurveyController
  validationSpy: ValidationSpy
  loadSurveySpy: PublisherLoadOneSurveySpy
}

const makeSut = (): SutTypes => {
  const loadSurveySpy = new PublisherLoadOneSurveySpy()
  const validationSpy = new ValidationSpy()
  const sut = new PublisherLoadOneSurveyController(loadSurveySpy, validationSpy)
  return {
    sut,
    loadSurveySpy,
    validationSpy
  }
}

describe('LoadSurveys Controller', () => {
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
    expect(loadSurveySpy.params.surveyId).toBe(request.surveyId)
    expect(loadSurveySpy.params.publisherAccountId).toBe(request.accountId)
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
    expect(httpResponse).toEqual(ok(mockSurveyToPublisherContext()))
  })

  test('Should return 500 if LoadSurvey trows', async () => {
    const { sut, loadSurveySpy } = makeSut()
    loadSurveySpy.load = () => { throw new Error() }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
