import { DbCheckSurveyContainsAnswer } from '@/application/data/services'
import { LoadSurveyByIdRepositorySpy } from '../mocks/repository-mocks'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: DbCheckSurveyContainsAnswer
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyContainsAnswer(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbCheckSurveyContainsAnswer Application Service', () => {
  test('Should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const verifyAnswerParams = { surveyId: 'any_survey_id', answer: 'any_answer' }
    await sut.verify(verifyAnswerParams)
    expect(loadSurveyByIdRepositorySpy.surveyId).toBe(verifyAnswerParams.surveyId)
  })

  test("Should return an InvalidParamError if answers don't contain the answer", async () => {
    const { sut } = makeSut()
    const verifyAnswerParams = { surveyId: 'any_survey_id', answer: 'wrong_answer' }
    const result = await sut.verify(verifyAnswerParams)
    expect(result).toEqual(new InvalidParamError('answer'))
  })

  test("Should return an InvalidParamError if the survey doesn't exists", async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.surveyResult = null
    const verifyAnswerParams = { surveyId: 'any_survey_id', answer: 'any_answer' }
    const result = await sut.verify(verifyAnswerParams)
    expect(result).toEqual(new InvalidParamError('surveyId'))
  })
})
