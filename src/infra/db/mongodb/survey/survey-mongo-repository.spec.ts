import { type Collection } from 'mongodb'
import { type SurveyModel } from '@/domain/models/survey'
import { type AddSurveyRepositoryParams } from '@/data/protocols/repositories/survey/add-survey-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { mockAddSurveyRepositoryParams } from '@/domain/models/mocks'
import env from '@/main/config/env'

let surveyCollection: Collection

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
      await surveyCollection.insertMany([
        mockAddSurveyRepositoryParams(),
        {
          question: 'other_question',
          answers: [{
            image: 'other_image',
            answer: 'other_answer',
            amountVotes: 0
          }],
          date: new Date(),
          totalAmountVotes: 0
        }] as AddSurveyRepositoryParams[])

      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[0].totalAmountVotes).toBe(0)
      expect(surveys[1].totalAmountVotes).toBe(0)
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
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
