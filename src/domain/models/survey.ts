export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
  totalAmountVotes: number
  didAnswer?: boolean
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
  amountVotes: number
  percent?: number
  isCurrentAccountAnswer?: boolean
}

type SurveyAnswerParams = Omit<SurveyAnswerModel, 'amountVotes' | 'percent' | 'isCurrentAccountAnswer'>

export type AddSurveyParams = Omit<SurveyModel, 'id' | 'totalAmountVotes' | 'answers'> & { answers: SurveyAnswerParams[] }
