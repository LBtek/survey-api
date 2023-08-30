export type SurveyID = string

export namespace Survey {
  export type Model = { id: SurveyID } & BaseDataModel.Body

  export namespace BaseDataModel {
    export type Body = {
      question: string
      answers: BaseAnswer[]
      date: Date
      totalAmountVotes: number
    }
    export type BaseAnswer = {
      image?: string
      answer: string
      amountVotes: number
    }
  }
}
