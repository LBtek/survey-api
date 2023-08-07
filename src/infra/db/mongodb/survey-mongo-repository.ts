/* eslint-disable @typescript-eslint/prefer-optional-chain */
import {
  type SurveyRepository,
  type PublisherAddSurveyRepository,
  type UserLoadAllSurveysRepository,
  type UserLoadOneSurveyRepository,
  type UserUpdateSurveyRepository,
  type LoadSurveyByIdRepository,
  type LoadSurveyByIdParams,
  type LoadSurveyByIdResult
} from '@/application/data/protocols/repositories'
import { MongoHelper } from './helpers/mongo-helper'
import { MongoAggregateQueryBuilder } from './helpers/query-builder'
import { ObjectId } from 'mongodb'

const makeFindSurveysQuery = (accountId: string, surveyId: string = null): object[] => {
  const query = new MongoAggregateQueryBuilder()
    .lookup({
      from: 'surveyVotes',
      let: { accID: new ObjectId(accountId), id: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$surveyId', '$$id'] },
                { $eq: ['$accountId', '$$accID'] }
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
      totalAmountVotes: 1,
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
          }
        }
      },
      date: 1,
      totalAmountVotes: 1,
      didAnswer: 1
    })
    .build()

  if (surveyId) query.unshift({ $match: { _id: new ObjectId(surveyId) } })

  return query
}

export class SurveyMongoRepository implements PublisherAddSurveyRepository, UserLoadOneSurveyRepository, UserLoadAllSurveysRepository, LoadSurveyByIdRepository, UserUpdateSurveyRepository {
  async add (surveyData: SurveyRepository.PublisherAddSurvey.Params): Promise<SurveyRepository.PublisherAddSurvey.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const result = await surveyCollection.insertOne(surveyData)

    if (result && result.insertedId) {
      return { surveyId: result.insertedId.toString() }
    }
  }

  async loadAll (data: SurveyRepository.UserLoadAllSurveys.Params): Promise<SurveyRepository.UserLoadAllSurveys.Result> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = makeFindSurveysQuery(data.accountId)
    const surveys = await surveysCollection.aggregate(query).toArray()
    return MongoHelper.mapManyDocumentsWithId(surveys)
  }

  async loadById (data: LoadSurveyByIdParams): Promise<LoadSurveyByIdResult> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({ _id: new ObjectId(data.id) })
    return survey && MongoHelper.mapOneDocumentWithId(survey)
  }

  async loadSurvey (data: SurveyRepository.UserLoadOneSurvey.Params): Promise<SurveyRepository.UserLoadOneSurvey.Result> {
    const { accountId, surveyId } = data
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = makeFindSurveysQuery(accountId, surveyId)
    const updatedSurvey = await surveysCollection.aggregate(query).toArray()
    return updatedSurvey.length && MongoHelper.mapOneDocumentWithId(updatedSurvey[0])
  }

  async update (data: SurveyRepository.UserUpdateSurvey.Params): Promise<SurveyRepository.UserUpdateSurvey.Result> {
    const { surveyId, oldAnswer, newAnswer, accountId } = data
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
                    { amountVotes: { $add: ['$$answer.amountVotes', 1] } }
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
                    { amountVotes: { $subtract: ['$$answer.amountVotes', 1] } }
                  ]
                },
                '$$answer'
              ]
            }
          }
        },
        totalAmountVotes: {
          $cond: [
            {
              $eq: [toHaveOldAnswer, false]
            },
            { $add: ['$totalAmountVotes', 1] },
            '$totalAmountVotes'
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

    return await this.loadSurvey({ surveyId, accountId })
  }
}
