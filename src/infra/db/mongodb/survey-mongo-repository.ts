import {
  type SurveyRepository,
  type IPublisherAddSurveyRepository,
  type IUserLoadAllSurveysRepository,
  type ILoadOneSurveyRepository,
  type IUserUpdateSurveyRepository,
  type ILoadSurveyByIdRepository,
  type LoadSurveyByIdParams,
  type LoadSurveyByIdResult
} from '@/application/data/protocols/repositories'
import { MongoHelper } from './helpers/mongo-helper'
import { MongoAggregateQueryBuilder } from './helpers/query-builder'
import { ObjectId } from 'mongodb'
import { type GuestID, type SurveyID, type UserID } from '@/domain/entities'

const makeFindSurveysQuery = (id: UserID | GuestID, type: 'user' | 'guest', surveyId: SurveyID = null): object[] => {
  const query = new MongoAggregateQueryBuilder()
    .lookup({
      from: `${type}SurveyVotes`,
      let: { userOrGuestID: new ObjectId(id), id: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$surveyId', '$$id'] },
                { $eq: [`$${type}Id`, '$$userOrGuestID'] }
              ]
            }
          }
        }
      ],
      as: 'result'
    })
    .project({
      _id: 1,
      question: 1,
      answers: 1,
      date: 1,
      totalNumberOfVotes: 1,
      didAnswer: {
        $gte: [{
          $size: '$result'
        }, 1]
      },
      lastAnswer: {
        $last: '$result'
      }
    })
    .project({
      _id: 1,
      question: 1,
      answers: {
        $map: {
          input: '$answers',
          as: 'item',
          in: {
            $cond: [
              { $eq: [type, 'user'] },
              {
                $mergeObjects: [
                  '$$item',
                  {
                    isCurrentAccountAnswer: {
                      $cond: [
                        { $eq: ['$$item.answer', '$lastAnswer.answer'] },
                        true,
                        false
                      ]
                    }
                  }
                ]
              },
              '$$item'
            ]
          }
        }
      },
      date: 1,
      totalNumberOfVotes: 1,
      didAnswer: {
        $cond: [
          { $eq: [type, 'user'] },
          '$didAnswer',
          0
        ]
      }
    })
    .build()

  if (surveyId) query.unshift({ $match: { _id: new ObjectId(surveyId) } })

  return query
}

export class SurveyMongoRepository implements IPublisherAddSurveyRepository, ILoadOneSurveyRepository, IUserLoadAllSurveysRepository, ILoadSurveyByIdRepository, IUserUpdateSurveyRepository {
  async add (surveyData: SurveyRepository.PublisherAddSurvey.Params): Promise<SurveyRepository.PublisherAddSurvey.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const result = await surveyCollection.insertOne(surveyData)

    if (result && result.insertedId) {
      return { surveyId: result.insertedId.toString() }
    }
  }

  async loadAll (data: SurveyRepository.UserLoadAllSurveys.Params): Promise<SurveyRepository.UserLoadAllSurveys.Result> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = makeFindSurveysQuery(data.userId, 'user')
    const surveys = await surveysCollection.aggregate(query).toArray()
    return MongoHelper.mapManyDocumentsWithId(surveys)
  }

  async loadById (data: LoadSurveyByIdParams): Promise<LoadSurveyByIdResult> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({ _id: new ObjectId(data.id) })
    return survey && MongoHelper.mapOneDocumentWithId(survey)
  }

  async loadSurvey (data: SurveyRepository.LoadOneSurvey.Params): Promise<SurveyRepository.LoadOneSurvey.Result> {
    const { userOrGuestId, type, surveyId } = data
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = makeFindSurveysQuery(userOrGuestId, type, surveyId)
    const updatedSurvey = await surveysCollection.aggregate(query).toArray()
    return updatedSurvey.length && MongoHelper.mapOneDocumentWithId(updatedSurvey[0])
  }

  async update (data: SurveyRepository.UpdateSurvey.Params): Promise<SurveyRepository.UpdateSurvey.Result> {
    const { surveyId, oldAnswer, newAnswer, userOrGuestId, type } = data
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const toHaveOldAnswer = !!oldAnswer

    const query = new MongoAggregateQueryBuilder()
      .set({
        answers: {
          $map: {
            input: '$answers',
            as: 'answer',
            in: {
              $cond: [
                { $eq: ['$$answer.answer', newAnswer] },
                {
                  $mergeObjects: [
                    '$$answer',
                    { numberOfVotes: { $add: ['$$answer.numberOfVotes', 1] } }
                  ]
                },
                '$$answer'
              ]
            }
          }
        }
      })
      .set({
        answers: {
          $map: {
            input: '$answers',
            as: 'answer',
            in: {
              $cond: [
                {
                  $and: [
                    { $eq: [toHaveOldAnswer, true] },
                    { $eq: ['$$answer.answer', oldAnswer] }
                  ]
                },
                {
                  $mergeObjects: [
                    '$$answer',
                    { numberOfVotes: { $subtract: ['$$answer.numberOfVotes', 1] } }
                  ]
                },
                '$$answer'
              ]
            }
          }
        },
        totalNumberOfVotes: {
          $cond: [
            {
              $eq: [toHaveOldAnswer, false]
            },
            { $add: ['$totalNumberOfVotes', 1] },
            '$totalNumberOfVotes'
          ]
        }
      })
      .build()

    await surveysCollection.updateOne(
      { _id: new ObjectId(surveyId) },
      query,
      {
        upsert: false
      })

    return await this.loadSurvey({ surveyId, userOrGuestId, type })
  }
}
