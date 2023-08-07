import { type Survey } from './survey'

export namespace SurveyVote {
  export namespace BaseDataModel {
    export type Body = {
      surveyId: string
      accountId: string
      answer: string
      date: Date
    }
  }

  export namespace Save {
    export type Params = BaseDataModel.Body
    export type Result = Survey.UserLoadOneSurvey.Result
  }
}
