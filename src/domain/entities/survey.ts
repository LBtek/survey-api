export type SurveyID = string

export namespace Survey {
  export type Model = { id: SurveyID } & BaseDataModel.Body

  export namespace BaseDataModel {
    export type Body = {
      question: string
      answers: BaseAnswer[]
      date: Date
      totalNumberOfVotes: number
    }
    export type BaseAnswer = {
      image?: string
      answer: string
      numberOfVotes: number
    }
  }
}
