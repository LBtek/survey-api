export type SurveyID = string

export namespace Survey {
  export type Model = { id: SurveyID } & BaseDataModel.Body
  export type ModelForPubisher = { id: SurveyID } & BaseDataModel.DataModelForPublisher

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
    export type DataModelForPublisher = Body & {
      publisherAccountId: string
    }
  }
}
