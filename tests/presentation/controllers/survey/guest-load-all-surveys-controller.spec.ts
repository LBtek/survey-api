import { GuestLoadAllSurveysController } from '@/presentation/controllers'
import { GuestLoadAllSurveysSpy } from '#/domain/mocks/usecases'
import { mockAllSurveysToGuestContext } from '#/domain/mocks/models'
import { forbidden, noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/application/errors'

type SutTypes = {
  sut: GuestLoadAllSurveysController
  loadSurveysSpy: GuestLoadAllSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new GuestLoadAllSurveysSpy()
  const sut = new GuestLoadAllSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockAllSurveysToGuestContext()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.surveys = []
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 403 if accessToken or role is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ role: 'basic_user' })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 500 if LoadSurveys trows', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.load = () => { throw new Error() }
    const httpResponse = await sut.handle({ role: null })
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
