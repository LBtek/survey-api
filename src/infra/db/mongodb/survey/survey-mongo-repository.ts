/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { type SurveyModel } from '@/domain/models/survey'
import { type LoadSurveyByIdRepository } from '@/presentation/protocols/repositories'
import { type AddSurveyRepositoryParams, type AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { type LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { type UpdateSurveyRepository } from '@/data/protocols/repositories/survey/update-survey-repository'
import { type LoadSurveyResultRepository } from '@/data/protocols/repositories/survey/load-survey-result-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoAggregateQueryBuilder } from '../helpers/query-builder'
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

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, UpdateSurveyRepository, LoadSurveyResultRepository {
  async add (surveyData: AddSurveyRepositoryParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = makeFindSurveysQuery(accountId)
    const surveys = await surveysCollection.aggregate(query).toArray()
    return MongoHelper.mapManyDocumentsWithId(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.mapOneDocumentWithId(survey)
  }

  async loadSurveyResult (surveyId: string, accountId: string): Promise<SurveyModel> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = makeFindSurveysQuery(accountId, surveyId)
    const updatedSurvey = await surveysCollection.aggregate(query).toArray()
    return updatedSurvey.length && MongoHelper.mapOneDocumentWithId(updatedSurvey[0])
  }

  async update (surveyId: string, oldAnswer: string = null, newAnswer: string, accountId: string): Promise<SurveyModel> {
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

    return await this.loadSurveyResult(surveyId, accountId)
  }
}
