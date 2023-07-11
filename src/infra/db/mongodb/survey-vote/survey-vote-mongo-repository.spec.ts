import { type Collection } from 'mongodb'
import { type AccountModel } from '@/domain/models/account'
import { type SurveyModel } from '@/domain/models/survey'
import { SurveyVoteMongoRepository } from './survey-vote-mongo-repository'
import { mockAddAccountParams, mockAddSurveyRepositoryParams } from '@/domain/models/mocks'
import { MongoHelper } from '../helpers/mongo-helper'
import env from '@/main/config/env'

let surveyCollection: Collection
let surveyVoteCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyVoteMongoRepository => {
  return new SurveyVoteMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyRepositoryParams())
  return MongoHelper.mapInsertOneResult(res, mockAddSurveyRepositoryParams())
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.mapInsertOneResult(res, mockAddAccountParams())
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyVoteCollection = await MongoHelper.getCollection('surveyVotes')
    await surveyVoteCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey vote if its new', async () => {
      const sut = makeSut()
      const account = await makeAccount()
      const survey = await makeSurvey()
      const surveyVote = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyVote).toBeUndefined()
    })

    test('Should update survey vote if its not new', async () => {
      const sut = makeSut()
      const account = await makeAccount()
      const survey = await makeSurvey()
      const oldData = {
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      }
      await sut.save(oldData)
      const newData = {
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      }
      const surveyVote = await sut.save(newData)
      expect(surveyVote).toBeTruthy()
      expect(surveyVote.id).toBeTruthy()
      expect(surveyVote.answer).toBe(oldData.answer)
      expect(surveyVote.date).toEqual(oldData.date)
    })
  })
})
