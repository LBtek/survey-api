import { type SaveSurveyVoteRepository } from '@/data/protocols/repositories/survey-vote/save-survey-vote-repository'
import { type SurveyVoteModel } from '@/domain/models/survey-vote'
import { type SaveSurveyVoteParams } from '@/domain/usecases/survey-vote/save-survey-vote'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyVoteMongoRepository implements SaveSurveyVoteRepository {
  async save (data: SaveSurveyVoteParams): Promise<SurveyVoteModel> {
    const surveyVotesCollection = await MongoHelper.getCollection('surveyVotes')
    const res = await surveyVotesCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId)
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
      const surveyVote: SurveyVoteModel = MongoHelper.mapOneDocumentWithId(res.value)
      surveyVote.surveyId = surveyVote.surveyId.toString()
      surveyVote.accountId = surveyVote.accountId.toString()

      return surveyVote
    }
  }
}
