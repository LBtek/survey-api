import { type SurveyModel } from '@/domain/models/survey'
import { type AddSurveyModel } from '@/domain/usecases/add-survey'
import { type AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocolls'
import { type LoadSurveysRepository } from '@/data/usecases/load-surveys/db-load-surveys-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const surveys = await MongoHelper.mapManyDocumentsWithId(surveysCollection.find())
    return surveys
  }
}
