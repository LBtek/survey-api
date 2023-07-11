export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
  totalAmountVotes: number
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
  amountVotes: number
  percent?: number
}

type SurveyAnswerParams = Omit<SurveyAnswerModel, 'amountVotes' | 'percent'>

export type AddSurveyParams = Omit<SurveyModel, 'id' | 'totalAmountVotes' | 'answers'> & { answers: SurveyAnswerParams[] }
