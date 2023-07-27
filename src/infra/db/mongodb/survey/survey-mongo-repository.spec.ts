import { type SurveyModel } from '@/domain/models/survey'
import { type AccountModel } from '@/domain/models/account'
import { type AddSurveyRepositoryParams } from '@/data/protocols/repositories/survey/add-survey-repository'
import { type Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockAddAccountParams, mockAddSurveyRepositoryParams } from '@/domain/models/mocks'
import env from '@/main/config/env'

let surveyCollection: Collection
let surveyVoteCollection: Collection
let accountCollection: Collection

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.mapInsertOneResult(res, mockAddAccountParams())
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
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

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyRepositoryParams())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const account = await makeAccount()
      const result = await surveyCollection.findOneAndReplace({},
        mockAddSurveyRepositoryParams(),
        {
          upsert: true,
          returnDocument: 'after'
        }
      )
      await surveyCollection.insertOne({
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer',
          amountVotes: 0
        }],
        date: new Date(),
        totalAmountVotes: 0
      })

      const survey = result.value

      await surveyVoteCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const account = await makeAccount()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const data: AddSurveyRepositoryParams = {
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer',
          amountVotes: 0
        }],
        date: new Date(),
        totalAmountVotes: 0
      }
      const res = await surveyCollection.insertOne(data)
      const sut = makeSut()
      const surveyLoaded = await sut.loadById(res.insertedId.toString())
      expect(surveyLoaded).toBeTruthy()
      expect(surveyLoaded.id).toBeTruthy()
    })
  })

  describe('update()', () => {
    test('Should return an updated Survey', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyRepositoryParams())
      const surveyFound = await surveyCollection.findOne({ question: 'any_question' })
      const survey: SurveyModel = MongoHelper.mapOneDocumentWithId(surveyFound)
      let updatedSurvey = await sut.update(survey.id, null, 'any_answer')
      let expectedAnswers = mockAddSurveyRepositoryParams().answers.map(a => {
        const answer = { ...a }
        if (answer.answer === 'any_answer') answer.amountVotes = 1
        return answer
      })
      expect(updatedSurvey).toBeTruthy()
      expect(updatedSurvey.id).toBeTruthy()
      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 1
      })

      updatedSurvey = await sut.update(survey.id, null, 'other_answer')

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        if (answer.answer === 'other_answer') answer.amountVotes = 1
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 2
      })

      updatedSurvey = await sut.update(survey.id, null, 'other_answer')

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        if (answer.answer === 'other_answer') answer.amountVotes = answer.amountVotes + 1
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 3
      })

      updatedSurvey = await sut.update(survey.id, 'other_answer', 'any_answer')

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        if (answer.answer === 'other_answer') answer.amountVotes = answer.amountVotes - 1
        if (answer.answer === 'any_answer') answer.amountVotes = answer.amountVotes + 1
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 3
      })

      updatedSurvey = await sut.update(survey.id, 'any_answer', 'any_answer')

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 3
      })
    })
  })
})
