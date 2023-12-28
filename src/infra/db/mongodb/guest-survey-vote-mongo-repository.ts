import { type GuestSurveyVoteRepository, type IGuestSaveSurveyVoteRepository } from '@/application/data/protocols/repositories'
import { MongoHelper } from './helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class GuestSurveyVoteMongoRepository implements IGuestSaveSurveyVoteRepository {
  async guestSaveVote (data: GuestSurveyVoteRepository.GuestSaveVote.Params): Promise<GuestSurveyVoteRepository.GuestSaveVote.Result> {
    const guestSurveyVotesCollection = await MongoHelper.getCollection('guestSurveyVotes')
    const res = await guestSurveyVotesCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      guestId: new ObjectId(data.guestId)
    }, {
      $set: {
        answer: data.answer,
        guestAgentId: data.guestAgentId,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'before'
    })
    if (res.value) {
      const surveyVote: GuestSurveyVoteRepository.GuestSaveVote.Result = MongoHelper.mapOneDocumentWithId(res.value)
      surveyVote.surveyId = surveyVote.surveyId.toString()
      surveyVote.guestId = surveyVote.guestId.toString()

      return surveyVote
    }
  }
}
