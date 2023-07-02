import { type SurveyModel } from '@/domain/models/survey'
import { type AddSurveyParams } from '@/domain/usecases/surveys/add-survey'

const date = new Date()

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }],
  date
})

export const mockSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
  ...mockAddSurveyParams()
})

export const mockSurveys = (): SurveyModel[] => {
  return [
    mockSurvey(),
    {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }],
      date
    }]
}
