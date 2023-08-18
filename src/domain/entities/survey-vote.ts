export namespace SurveyVote {
  export namespace BaseDataModel {
    export type Body = {
      surveyId: string
      accountId: string
      answer: string
      date: Date
    }
  }
}
