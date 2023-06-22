import { type SurveyModel } from '@/domain/models/survey'
import { type AddSurveyModel } from '@/domain/usecases/surveys/add-survey'
import { type AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocolls'
import { type LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'
import { type LoadSurveyById } from '@/domain/usecases/surveys/load-survey-by-id'
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (surveyData: AddSurveyModel): Promise<void> {
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
    const survey = MongoHelper.mapOneDocumentWithId(await surveysCollection.findOne({ _id: new ObjectId(id) }))
    return survey
  }
}
