import { type SurveyVoteRepository, type SaveSurveyVoteRepository } from '@/application/data/protocols/repositories'
import { MongoHelper } from './helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyVoteMongoRepository implements SaveSurveyVoteRepository {
  async save (data: SurveyVoteRepository.Save.Params): Promise<SurveyVoteRepository.Save.Result> {
    const surveyVotesCollection = await MongoHelper.getCollection('surveyVotes')
    const res = await surveyVotesCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      userId: new ObjectId(data.userId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'before'
    })
    if (res.value) {
      const surveyVote: SurveyVoteRepository.Save.Result = MongoHelper.mapOneDocumentWithId(res.value)
      surveyVote.surveyId = surveyVote.surveyId.toString()
      surveyVote.userId = surveyVote.userId.toString()

      return surveyVote
    }
  }
}
