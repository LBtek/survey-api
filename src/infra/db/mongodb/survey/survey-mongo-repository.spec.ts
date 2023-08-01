import { type SurveyModel } from '@/domain/models/survey'
import { type AccountModel } from '@/domain/models/account'
import { type AddSurveyRepositoryParams } from '@/data/protocols/repositories/survey/add-survey-repository'
import { type Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { SurveyVoteMongoRepository } from '../survey-vote/survey-vote-mongo-repository'
import { mockAddAccountParams, mockAddSurveyRepositoryParams } from '@/domain/models/mocks'
import env from '@/main/config/env'

let surveyCollection: Collection
let surveyVoteCollection: Collection
let accountCollection: Collection

class SaveVoteAndUpdateSurvey {
  constructor (
    private readonly surveyRepository: SurveyMongoRepository,
    private readonly saveSurveyVoteRepository: SurveyVoteMongoRepository
  ) { }

  async saveAndUpdate (
    surveyId: string,
    oldAnswer: string,
    newAnswer: string,
    accountId: string
  ): Promise<SurveyModel> {
    await this.saveSurveyVoteRepository.save({
      surveyId,
      accountId,
      answer: newAnswer,
      date: new Date()
    })
    const survey = await this.surveyRepository.update(surveyId, oldAnswer, newAnswer, accountId)
    return survey
  }
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.mapInsertOneResult(res, mockAddAccountParams())
}

type SutTypes = {
  sut: SurveyMongoRepository
  saveSurveyVoteAndUpdateSurvey: SaveVoteAndUpdateSurvey
}

const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()
  const saveSurveyVoteRepository = new SurveyVoteMongoRepository()
  const saveSurveyVoteAndUpdateSurvey = new SaveVoteAndUpdateSurvey(sut, saveSurveyVoteRepository)

  return {
    sut,
    saveSurveyVoteAndUpdateSurvey
  }
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
      const { sut } = makeSut()
      await sut.add(mockAddSurveyRepositoryParams())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const account = await makeAccount()

      const firstSurveyAdded = await surveyCollection.findOneAndReplace({},
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

      const firstSurvey = firstSurveyAdded.value

      await surveyVoteCollection.insertOne({
        surveyId: firstSurvey._id,
        accountId: new ObjectId(account.id),
        answer: firstSurvey.answers[0].answer,
        date: new Date()
      })

      const { sut } = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].didAnswer).toBe(false)
      expect(surveys[0].answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveys[0].answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveys[1].answers[0].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const { sut } = makeSut()
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
      const { sut } = makeSut()
      const surveyLoaded = await sut.loadById(res.insertedId.toString())
      expect(surveyLoaded).toBeTruthy()
      expect(surveyLoaded.id).toBeTruthy()
    })
  })

  describe('update()', () => {
    test('Should return an updated Survey', async () => {
      const { sut, saveSurveyVoteAndUpdateSurvey } = makeSut()
      await sut.add(mockAddSurveyRepositoryParams())
      const surveyFound = await surveyCollection.findOne({ question: 'any_question' })
      const survey: SurveyModel = MongoHelper.mapOneDocumentWithId(surveyFound)

      let updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        null,
        'any_answer',
        (await makeAccount()).id
      )

      let expectedAnswers = mockAddSurveyRepositoryParams().answers.map(a => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (answer.answer === 'any_answer') {
          answer.amountVotes = 1
          answer.isCurrentAccountAnswer = true
        }
        return answer
      })

      expect(updatedSurvey).toBeTruthy()
      expect(updatedSurvey.id).toBeTruthy()
      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 1,
        didAnswer: true
      })

      updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        null,
        'other_answer',
        (await makeAccount()).id
      )

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (answer.answer === 'other_answer') {
          answer.isCurrentAccountAnswer = true
          answer.amountVotes = 1
        }
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 2,
        didAnswer: true
      })

      const account = await makeAccount()

      updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        null,
        'other_answer',
        account.id
      )

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (answer.answer === 'other_answer') {
          answer.isCurrentAccountAnswer = true
          answer.amountVotes = answer.amountVotes + 1
        }
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 3,
        didAnswer: true
      })

      updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        'other_answer',
        'any_answer',
        account.id
      )

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (answer.answer === 'other_answer') answer.amountVotes = answer.amountVotes - 1
        if (answer.answer === 'any_answer') {
          answer.isCurrentAccountAnswer = true
          answer.amountVotes = answer.amountVotes + 1
        }
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 3,
        didAnswer: true
      })

      updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        'any_answer',
        'any_answer',
        account.id
      )

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalAmountVotes: 3,
        didAnswer: true
      })
    })
  })
})
