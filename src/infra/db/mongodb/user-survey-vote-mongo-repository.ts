import { type UserSurveyVoteRepository, type IUserSaveSurveyVoteRepository } from '@/application/data/protocols/repositories'
import { MongoHelper } from './helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class UserSurveyVoteMongoRepository implements IUserSaveSurveyVoteRepository {
  async userSaveVote (data: UserSurveyVoteRepository.UserSaveVote.Params): Promise<UserSurveyVoteRepository.UserSaveVote.Result> {
    const userSurveyVotesCollection = await MongoHelper.getCollection('userSurveyVotes')
    const res = await userSurveyVotesCollection.findOneAndUpdate({
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
      const surveyVote: UserSurveyVoteRepository.UserSaveVote.Result = MongoHelper.mapOneDocumentWithId(res.value)
      surveyVote.surveyId = surveyVote.surveyId.toString()
      surveyVote.userId = surveyVote.userId.toString()

      return surveyVote
    }
  }
}
