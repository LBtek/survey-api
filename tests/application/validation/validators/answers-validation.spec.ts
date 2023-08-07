import { type Survey } from '@/domain/entities'
import { AnswersValidation } from '@/application/validation/validators'
import { AnswerFormatError, AnswersInstanceTypeError } from '@/presentation/errors'

const makeSut = (): AnswersValidation => {
  return new AnswersValidation()
}

const mockSurvey = (): Omit<Survey.BaseDataModel.Body, 'totalAmountVotes' | 'answers'> & { answers: any } => ({
  question: 'any_question',
  answers: [{ answer: 'any_answer' }],
  date: new Date()
})

describe('RequiredField Validation', () => {
  test('Should return an AnswersInstanceTypeError if answers is not an array', () => {
    const sut = makeSut()
    const survey = mockSurvey()
    survey.answers = {}
    const error = sut.validate(survey)
    expect(error).toEqual(new AnswersInstanceTypeError())
  })
  test('Should return an AnswerFormatError if any answer is not of type string', () => {
    const sut = makeSut()
    const survey = mockSurvey()
    survey.answers = [{ answer: {} }]
    const error = sut.validate(survey)
    expect(error).toEqual(new AnswerFormatError())
  })
  test('Should return an AnswerFormatError if any answer is an empty string', () => {
    const sut = makeSut()
    const survey = mockSurvey()
    survey.answers = [{ answer: '   ' }]
    const error = sut.validate(survey)
    expect(error).toEqual(new AnswerFormatError())
  })
  test('Should return an AnswerFormatError if any answer image is not of type string', () => {
    const sut = makeSut()
    const survey = mockSurvey()
    survey.answers = [{ answer: 'any_answer', image: 123 }]
    const error = sut.validate(survey)
    expect(error).toEqual(new AnswerFormatError())
  })
  test('Should return an AnswerFormatError if any answer image is an empty string', () => {
    const sut = makeSut()
    const survey = mockSurvey()
    survey.answers = [{ answer: 'any_answer', image: '   ' }]
    const error = sut.validate(survey)
    expect(error).toEqual(new AnswerFormatError())
  })
  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const survey = mockSurvey()
    const error = sut.validate(survey)
    expect(error).toBeFalsy()
  })
})
