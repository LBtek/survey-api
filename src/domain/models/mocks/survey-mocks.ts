import { type AddSurveyRepositoryParams } from '@/data/protocols/repositories/survey/add-survey-repository'
import { type SurveyModel, type AddSurveyParams } from '@/domain/models/survey'

const date = new Date()

const mockAnswers = (): any[] => {
  return [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }]
}

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: mockAnswers(),
  date
})

export const mockAddSurveyRepositoryParams = (): AddSurveyRepositoryParams => {
  const answers = mockAnswers().map(answer => {
    answer.amountVotes = 0
    return answer
  })
  return {
    ...mockAddSurveyParams(),
    answers,
    totalAmountVotes: 0
  }
}

export const mockSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
  ...mockAddSurveyRepositoryParams()
})

export const mockSurveys = (): SurveyModel[] => {
  return [
    mockSurvey(),
    {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer',
        amountVotes: 0
      }],
      date,
      totalAmountVotes: 0
    }]
}
