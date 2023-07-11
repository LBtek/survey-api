import { type HttpRequest } from './save-survey-vote-controller-protocols'
import { SaveSurveyVoteController } from './save-survey-vote-controller'
import { mockSurvey } from '@/domain/models/mocks'
import { LoadSurveyByIdSpy, SaveSurveyVoteSpy } from '@/domain/usecases/_mocks'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

type SutTypes = {
  sut: SaveSurveyVoteController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyVoteSpy: SaveSurveyVoteSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const saveSurveyVoteSpy = new SaveSurveyVoteSpy()
  const sut = new SaveSurveyVoteController(loadSurveyByIdSpy, saveSurveyVoteSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyVoteSpy
  }
}

describe('SaveSurveyVote Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    await sut.handle(makeFakeRequest())
    expect(loadSurveyByIdSpy.id).toBe('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById trows', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyVote with correct values', async () => {
    const { sut, saveSurveyVoteSpy } = makeSut()
    await sut.handle(makeFakeRequest())
    expect(saveSurveyVoteSpy.saveSurveyVoteData).toEqual({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyVote trows', async () => {
    const { sut, saveSurveyVoteSpy } = makeSut()
    jest.spyOn(saveSurveyVoteSpy, 'save').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({
      ...mockSurvey(),
      answers: mockSurvey().answers.map(a => {
        if (a.answer === 'any_answer') {
          a.amountVotes = 1
          a.percent = 100
        }
        return a
      }),
      totalAmountVotes: 1
    }))
  })
})
