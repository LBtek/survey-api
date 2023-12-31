import { PublisherAddSurveyController } from '@/presentation/controllers'
import { PublisherAddSurveySpy } from '#/domain/mocks/usecases'
import { mockAddSurveyParams } from '#/domain/mocks/models'
import { ValidationSpy } from '#/presentation/_mocks'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { AnswersLengthError } from '@/domain/errors'

const mockRequest = (): any => ({
  ...mockAddSurveyParams(),
  accountId: mockAddSurveyParams().publisherAccountId,
  date: new Date()
})

type SutTypes = {
  sut: PublisherAddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: PublisherAddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new PublisherAddSurveySpy()
  const sut = new PublisherAddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

describe('PublisherAddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toBe(request)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call PublisherAddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    delete request.accountId
    expect(addSurveySpy.addSurveyData).toEqual(request)
  })

  test('Should return 400 if PublisherAddSurvey returns an error', async () => {
    const { sut, addSurveySpy } = makeSut()
    addSurveySpy.result = new AnswersLengthError()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new AnswersLengthError()))
  })

  test('Should return 500 if PublisherAddSurvey trows', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
