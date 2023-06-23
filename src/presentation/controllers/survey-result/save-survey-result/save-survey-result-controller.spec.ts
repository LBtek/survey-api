import { type LoadSurveyById, type HttpRequest, type SurveyModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

const fakeSurvey: SurveyModel = {
  id: 'any_survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }],
  date: new Date()
}

/* const fakeSurveyResult: SurveyResultModel = {
  id: 'any_survey_result_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
} */

const makeFakeSurvey = (): SurveyModel => ({ ...fakeSurvey })
// const makeFakeSurveyResult = (): SurveyModelResult => ({ ...fakeSurveyResult })

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (): Promise<SurveyModel> {
      return await new Promise(resolve => { resolve(makeFakeSurvey()) })
    }
  }
  return new LoadSurveyByIdStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSaveSurveyResultController = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSaveSurveyResultController()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
