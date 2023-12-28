import { type IP } from '@/application/entities'
import { type Email } from '@/domain/value-objects'
import { type GuestSaveSurveyVote } from '@/domain/models'
import { InvalidParamError } from '@/presentation/errors'
import { GuestSaveSurveyVoteController } from '@/presentation/controllers/survey-vote'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { CheckSurveyAnswerServiceSpy } from '#/presentation/_mocks/services-mocks'
import { ValidationSpy } from '#/presentation/_mocks'
import { GuestSaveSurveyVoteSpy, SaveGuestSpy } from '#/domain/mocks/usecases'
import { mockSurvey } from '#/domain/mocks/models'
import MockDate from 'mockdate'
import { CheckUserAccountByEmailRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { EmailInUseError } from '@/domain/errors'

let originalError

const mockRequest = (): GuestSaveSurveyVote.Params & {
  ip: IP
  name: string
  email: Email
  userAgent: string
  guestAgentId: string | null
} => ({
  ip: 'any_ip',
  userAgent: 'any_user_agent',
  name: null,
  email: null,
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  guestId: 'any_guest_id',
  guestAgentId: 'any_guest_agent_id',
  date: new Date()
})

type SutTypes = {
  sut: GuestSaveSurveyVoteController
  checkSurveyContainsAnswerServiceSpy: CheckSurveyAnswerServiceSpy
  guestSaveSurveyVoteSpy: GuestSaveSurveyVoteSpy
  saveGuestSpy: SaveGuestSpy
  validationSpy: ValidationSpy
  checkUserAccountByEmailRepositorySpy: CheckUserAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveGuestSpy = new SaveGuestSpy()
  const guestSaveSurveyVoteSpy = new GuestSaveSurveyVoteSpy()
  const checkUserAccountByEmailRepositorySpy = new CheckUserAccountByEmailRepositorySpy()
  const validationSpy = new ValidationSpy()
  const checkSurveyContainsAnswerServiceSpy = new CheckSurveyAnswerServiceSpy()
  originalError = checkSurveyContainsAnswerServiceSpy.error
  checkSurveyContainsAnswerServiceSpy.error = null
  const sut = new GuestSaveSurveyVoteController(
    validationSpy,
    guestSaveSurveyVoteSpy,
    checkSurveyContainsAnswerServiceSpy,
    saveGuestSpy,
    checkUserAccountByEmailRepositorySpy
  )

  return {
    sut,
    checkSurveyContainsAnswerServiceSpy,
    guestSaveSurveyVoteSpy,
    saveGuestSpy,
    validationSpy,
    checkUserAccountByEmailRepositorySpy
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
    checkSurveyContainsAnswerServiceSpy.verify = () => { throw new Error() }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkUserAccountByEmailRepositorySpy } = makeSut()
    const request = { ...mockRequest(), email: 'any_email' }
    await sut.handle(request)
    expect(checkUserAccountByEmailRepositorySpy.email).toBe(request.email)
  })

  test('Should return 400 if CheckEmail returns an EmailInUseError', async () => {
    const { sut, checkUserAccountByEmailRepositorySpy } = makeSut()
    checkUserAccountByEmailRepositorySpy.result = true
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new EmailInUseError()))
  })

  test('Should return 500 if CheckAccountByEmailRepository trows', async () => {
    const { sut, checkUserAccountByEmailRepositorySpy } = makeSut()
    checkUserAccountByEmailRepositorySpy.checkByEmail = () => { throw new Error() }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call SaveGuest usecase with correct values', async () => {
    const { sut, saveGuestSpy } = makeSut()
    await sut.handle(mockRequest())
    expect(saveGuestSpy.params.ip).toBe('any_ip')
    expect(saveGuestSpy.params.userAgent).toBe('any_user_agent')
    expect(saveGuestSpy.params.guestAgentId).toBe('any_guest_agent_id')
    expect(saveGuestSpy.params.name).toBeNull()
    expect(saveGuestSpy.params.email).toBeNull()
  })

  test('Should return 500 if SaveGuest trows', async () => {
    const { sut, saveGuestSpy } = makeSut()
    saveGuestSpy.save = () => { throw new Error() }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call GuestSaveSurveyVote usecase with correct values', async () => {
    const { sut, guestSaveSurveyVoteSpy } = makeSut()
    await sut.handle(mockRequest())
    expect(guestSaveSurveyVoteSpy.saveSurveyVoteData).toEqual({
      surveyId: 'any_survey_id',
      guestId: 'any_guest_id',
      guestAgentId: 'any_guest_agent_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if GuestSaveSurveyVote trows', async () => {
    const { sut, guestSaveSurveyVoteSpy } = makeSut()
    guestSaveSurveyVoteSpy.save = () => { throw new Error() }
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut, saveGuestSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      survey: {
        ...mockSurvey(),
        answers: mockSurvey().answers.map((a: any) => {
          if (a.answer === 'any_answer') {
            a.numberOfVotes = 1
            a.percent = 100
          }
          return a
        }),
        totalNumberOfVotes: 1
      },
      guest: saveGuestSpy.result
    }))
  })
})
