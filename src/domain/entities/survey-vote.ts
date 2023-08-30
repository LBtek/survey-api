import { type SurveyID } from './survey'
import { type UserID } from './user'

export namespace SurveyVote {
  export namespace BaseDataModel {
    export type Body = {
      userId: UserID
      surveyId: SurveyID
      answer: string
      date: Date
    }
  }
}
