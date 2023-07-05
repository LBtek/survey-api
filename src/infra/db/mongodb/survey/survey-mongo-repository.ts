import { type SurveyModel } from '@/domain/models/survey'
import { type AddSurveyRepositoryParams, type AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { type LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { type LoadSurveyByIdRepository } from '@/data/protocols/repositories/survey/load-survey-by-id-repository'
import { type UpdateSurveyRepository } from '@/data/protocols/repositories/survey/update-survey-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, UpdateSurveyRepository {
  async add (surveyData: AddSurveyRepositoryParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const surveys = await MongoHelper.mapManyDocumentsWithId(surveysCollection.find())
    return surveys
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.mapOneDocumentWithId(survey)
  }

  async update (survey: SurveyModel, oldAnswer: string = null, newAnswer: string): Promise<SurveyModel> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const toHaveOldAnswer = !!oldAnswer
    const updatedSurvey = await surveysCollection.findOneAndUpdate(
      { _id: new ObjectId(survey.id) },
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
    return updatedSurvey?.ok && MongoHelper.mapOneDocumentWithId(updatedSurvey.value)
  }
}
