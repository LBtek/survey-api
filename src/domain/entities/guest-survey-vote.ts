import { type SurveyID } from './survey'
import { type GuestID, type GuestAgentID } from './guest'

export namespace GuestSurveyVote {
  export type Model = { id: string } & BaseDataModel.Body

  export namespace BaseDataModel {
    export type Body = {
      guestId: GuestID
      guestAgentId: GuestAgentID
      surveyId: SurveyID
      answer: string
      date: Date
    }
  }
}
