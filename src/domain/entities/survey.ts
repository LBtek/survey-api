export namespace Survey {
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
