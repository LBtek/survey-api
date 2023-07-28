/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { type AllSurveys, type SurveyModel } from '@/domain/models/survey'
import { type LoadSurveyByIdRepository } from '@/presentation/protocols/repositories'
import { type AddSurveyRepositoryParams, type AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { type LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { type UpdateSurveyRepository } from '@/data/protocols/repositories/survey/update-survey-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoAggregateQueryBuilder } from '../helpers/query-builder'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, UpdateSurveyRepository {
  async add (surveyData: AddSurveyRepositoryParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (accountId: string): Promise<AllSurveys> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const query = new MongoAggregateQueryBuilder()
      .lookup({
        from: 'surveyVotes',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()

    const surveys = await surveysCollection.aggregate(query).toArray()
    return await MongoHelper.mapManyDocumentsWithId(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.mapOneDocumentWithId(survey)
  }

  async loadByIdWithCurrentAccountAnswer (surveyId: string, accountId: string): Promise<SurveyModel> {
    return null
  }

  async update (surveyId: string, oldAnswer: string = null, newAnswer: string): Promise<SurveyModel> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const toHaveOldAnswer = !!oldAnswer
    const updatedSurvey = await surveysCollection.findOneAndUpdate(
      { _id: new ObjectId(surveyId) },
      [
        {
          $set: {
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
          }
        },
        {
          $set: {
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
          }
        }
      ],
      {
        upsert: false,
        returnDocument: 'after'
      }
    )
    return updatedSurvey && updatedSurvey.ok && MongoHelper.mapOneDocumentWithId(updatedSurvey.value)
  }
}
