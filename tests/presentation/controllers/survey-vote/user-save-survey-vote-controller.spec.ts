import { type UserSaveSurveyVote, type AnswerToUserContext } from '@/domain/models'
import { InvalidParamError } from '@/presentation/errors'
import { UserSaveSurveyVoteController } from '@/presentation/controllers/survey-vote/user-save-survey-vote-controller'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { CheckSurveyAnswerServiceSpy } from '#/presentation/_mocks/services-mocks'
import { ValidationSpy } from '#/presentation/_mocks'
import { UserSaveSurveyVoteSpy } from '#/domain/mocks/usecases'
import { mockSurvey } from '#/domain/mocks/models'
import MockDate from 'mockdate'

let originalError

const mockRequest = (): UserSaveSurveyVote.Params => ({
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  userId: 'any_user_id',
  date: new Date()
})

type SutTypes = {
  sut: UserSaveSurveyVoteController
  checkSurveyContainsAnswerServiceSpy: CheckSurveyAnswerServiceSpy
  userSaveSurveyVoteSpy: UserSaveSurveyVoteSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const checkSurveyContainsAnswerServiceSpy = new CheckSurveyAnswerServiceSpy()
  originalError = checkSurveyContainsAnswerServiceSpy.error
  checkSurveyContainsAnswerServiceSpy.error = null
  const userSaveSurveyVoteSpy = new UserSaveSurveyVoteSpy()
  const validationSpy = new ValidationSpy()
  const sut = new UserSaveSurveyVoteController(validationSpy, checkSurveyContainsAnswerServiceSpy, userSaveSurveyVoteSpy)
  return {
    sut,
    checkSurveyContainsAnswerServiceSpy,
    userSaveSurveyVoteSpy,
    validationSpy
  }
}

describe('UserSaveSurveyVote Controller', () => {
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

  test('Should call CheckSurveyAnswerService with correct values', async () => {
    const { sut, checkSurveyContainsAnswerServiceSpy } = makeSut()
    await sut.handle(mockRequest())
    expect(checkSurveyContainsAnswerServiceSpy.id).toBe('any_survey_id')
  })

  test('Should return 400 if CheckSurveyContainsAnswerService returns an InvalidParamError', async () => {
    const { sut, checkSurveyContainsAnswerServiceSpy } = makeSut()
    checkSurveyContainsAnswerServiceSpy.error = originalError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(originalError))
  })

  test('Should return 500 if CheckSurveyAnswerService trows', async () => {
    const { sut, checkSurveyContainsAnswerServiceSpy } = makeSut()
    jest.spyOn(checkSurveyContainsAnswerServiceSpy, 'verify').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call UserSaveSurveyVote usecase with correct values', async () => {
    const { sut, userSaveSurveyVoteSpy } = makeSut()
    await sut.handle(mockRequest())
    expect(userSaveSurveyVoteSpy.saveSurveyVoteData).toEqual({
      surveyId: 'any_survey_id',
      userId: 'any_user_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if UserSaveSurveyVote trows', async () => {
    const { sut, userSaveSurveyVoteSpy } = makeSut()
    jest.spyOn(userSaveSurveyVoteSpy, 'save').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      ...mockSurvey(),
      answers: mockSurvey().answers.map((a: AnswerToUserContext) => {
        a.isCurrentAccountAnswer = false
        if (a.answer === 'any_answer') {
          a.numberOfVotes = 1
          a.percent = 100
          a.isCurrentAccountAnswer = true
        }
        return a
      }),
      totalNumberOfVotes: 1,
      didAnswer: true
    }))
  })
})
