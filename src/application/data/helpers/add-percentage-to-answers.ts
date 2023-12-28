import { type AnswerToUserContext } from '@/domain/models'
import { type SurveyRepository } from '../protocols/repositories'

type Answers = Omit<AnswerToUserContext, 'isCurrentAccountAnswer'> & { isCurrentAccountAnswer?: boolean }

export const addPercentageToAnswers = (survey: SurveyRepository.LoadOneSurvey.Result):
Omit<SurveyRepository.LoadOneSurvey.Result, 'answers'> & { answers: Answers[] } => {
  const newAnswers = survey.answers.map((a: Answers) => {
    const answer = { ...a }

    answer.percent = answer.numberOfVotes && survey.totalNumberOfVotes
      ? Number(((answer.numberOfVotes / survey.totalNumberOfVotes) * 100).toFixed(2))
      : 0.00

    return answer
  })

  return { ...survey, answers: newAnswers }
}
