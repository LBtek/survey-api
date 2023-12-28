import { type GuestSurveyVote } from '@/domain/entities'
import { type GuestSaveSurveyVote } from '@/domain/models'

export namespace GuestSurveyVoteRepository {
  export namespace GuestSaveVote {
    export type Params = GuestSaveSurveyVote.Params
    export type Result = GuestSurveyVote.Model | null | undefined
  }
}

export interface IGuestSaveSurveyVoteRepository {
  guestSaveVote: (data: GuestSurveyVoteRepository.GuestSaveVote.Params) => Promise<GuestSurveyVoteRepository.GuestSaveVote.Result>
}
