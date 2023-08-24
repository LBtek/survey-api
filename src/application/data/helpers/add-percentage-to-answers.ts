import { type UserLoadOneSurvey, type AnswerToUserContext } from '@/domain/models'
import { type SurveyRepository } from '../protocols/repositories'

export const addPercentageToAnswers = (survey: SurveyRepository.UserLoadOneSurvey.Result): UserLoadOneSurvey.Result => {
  const newAnswers = survey.answers.map((a: AnswerToUserContext) => {
    const answer = { ...a }

    answer.percent = answer.amountVotes && survey.totalAmountVotes
      ? Number(((answer.amountVotes / survey.totalAmountVotes) * 100).toFixed(2))
      : 0.00

    return answer
  })

  return { ...survey, answers: newAnswers }
}
