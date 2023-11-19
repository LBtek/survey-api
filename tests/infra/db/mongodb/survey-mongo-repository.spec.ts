import { type AnswerToUserContext } from '@/domain/models'
import { type AccountRepository } from '@/application/data/protocols/repositories/account-repository'
import { type Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository'
import { SurveyVoteMongoRepository } from '@/infra/db/mongodb/survey-vote-mongo-repository'
import { mockAddAccountParams, mockAddSurveyRepositoryParams } from '#/domain/mocks/models'
import env from '@/main/config/env'

let surveyCollection: Collection
let surveyVoteCollection: Collection
let accountCollection: Collection
let userCollection: Collection

class SaveVoteAndUpdateSurvey {
  constructor (
    private readonly surveyRepository: SurveyMongoRepository,
    private readonly saveSurveyVoteRepository: SurveyVoteMongoRepository
  ) { }

  async saveAndUpdate (
    surveyId: string,
    oldAnswer: string,
    newAnswer: string,
    userId: string
  ): Promise<any> {
    await this.saveSurveyVoteRepository.save({
      surveyId,
      userId,
      answer: newAnswer,
      date: new Date()
    })
    const survey = await this.surveyRepository.update({ surveyId, oldAnswer, newAnswer, userId })
    return survey
  }
}

const makeAccount = async (): Promise<AccountRepository.LoadUserAccountByEmail.Result> => {
  const userData = {
    name: mockAddAccountParams().name,
    email: mockAddAccountParams().email
  }
  const insertedUser = await userCollection.insertOne(userData)
  const accountData = {
    userId: insertedUser.insertedId,
    password: mockAddAccountParams().password,
    role: mockAddAccountParams().role
  }
  const account = await accountCollection.insertOne(accountData)
  const user = MongoHelper.mapInsertOneResult(insertedUser, userData)
  const { id: accountId } = MongoHelper.mapInsertOneResult(account, accountData)

  return {
    accountId,
    ...accountData,
    user
  }
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
    await MongoHelper.connect(env.mongodb.url)
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
    userCollection = await MongoHelper.getCollection('users')
    await userCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const { sut } = makeSut()
      const result = await sut.add(mockAddSurveyRepositoryParams())
      expect(result?.surveyId).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const { user } = await makeAccount()
      const userId = user.id

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
          numberOfVotes: 0
        }],
        date: new Date(),
        totalNumberOfVotes: 0
      })

      const firstSurvey = firstSurveyAdded.value

      await surveyVoteCollection.insertOne({
        surveyId: firstSurvey._id,
        userId: new ObjectId(userId),
        answer: firstSurvey.answers[0].answer,
        date: new Date()
      })

      const { sut } = makeSut()
      const surveys = await sut.loadAll({ userId })
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
      const { user } = await makeAccount()
      const surveys = await sut.loadAll({ userId: user.id })
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyRepositoryParams())
      const { sut } = makeSut()
      const surveyId = res.insertedId.toString()
      const surveyLoaded = await sut.loadById({ id: res.insertedId.toString() })
      expect(surveyLoaded).toBeTruthy()
      expect(surveyLoaded.id).toBeTruthy()
      expect(surveyLoaded.id).toBe(surveyId)
    })
  })

  describe('loadSurvey()', () => {
    test('Should load survey with current account answer on success', async () => {
      const { user } = await makeAccount()
      const surveyAdded = await surveyCollection.findOneAndReplace({},
        mockAddSurveyRepositoryParams(),
        {
          upsert: true,
          returnDocument: 'after'
        }
      )
      const survey = surveyAdded.value
      const { sut } = makeSut()
      await surveyVoteCollection.insertOne({
        surveyId: survey._id,
        userId: new ObjectId(user.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyId = survey._id.toString()
      const surveyLoaded = await sut.loadSurvey({ surveyId, userId: user.id })
      expect(surveyLoaded).toBeTruthy()
      expect(surveyLoaded.id).toBeTruthy()
      expect(surveyLoaded.id).toBe(surveyId)
      expect(surveyLoaded.didAnswer).toBe(true)
      expect(surveyLoaded.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyLoaded.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test("Must load the survey even if the user hasn't answered it yet", async () => {
      const { user } = await makeAccount()
      const res = await surveyCollection.insertOne(mockAddSurveyRepositoryParams())
      const { sut } = makeSut()
      const surveyId = res.insertedId.toString()
      const surveyLoaded = await sut.loadSurvey({ surveyId, userId: user.id })
      expect(surveyLoaded).toBeTruthy()
      expect(surveyLoaded.id).toBeTruthy()
      expect(surveyLoaded.id).toBe(surveyId)
      expect(surveyLoaded.didAnswer).toBe(false)
      expect(surveyLoaded.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyLoaded.answers[1].isCurrentAccountAnswer).toBe(false)
    })
  })

  describe('update()', () => {
    test('Should return an updated Survey', async () => {
      const { sut, saveSurveyVoteAndUpdateSurvey } = makeSut()
      await sut.add(mockAddSurveyRepositoryParams())
      const surveyFound = await surveyCollection.findOne({ question: 'any_question' })
      const survey: any = MongoHelper.mapOneDocumentWithId(surveyFound)

      let updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        null,
        'any_answer',
        (await makeAccount()).user.id
      )

      let expectedAnswers = mockAddSurveyRepositoryParams().answers.map((a: AnswerToUserContext) => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (answer.answer === 'any_answer') {
          answer.numberOfVotes = 1
          answer.isCurrentAccountAnswer = true
        }
        return answer
      })

      expect(updatedSurvey).toBeTruthy()
      expect(updatedSurvey.id).toBeTruthy()
      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalNumberOfVotes: 1,
        didAnswer: true
      })

      updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        null,
        'other_answer',
        (await makeAccount()).user.id
      )

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (answer.answer === 'other_answer') {
          answer.isCurrentAccountAnswer = true
          answer.numberOfVotes = 1
        }
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalNumberOfVotes: 2,
        didAnswer: true
      })

      const account = await makeAccount()

      updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        null,
        'other_answer',
        account.user.id
      )

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (answer.answer === 'other_answer') {
          answer.isCurrentAccountAnswer = true
          answer.numberOfVotes = answer.numberOfVotes + 1
        }
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalNumberOfVotes: 3,
        didAnswer: true
      })

      updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        'other_answer',
        'any_answer',
        account.user.id
      )

      expectedAnswers = expectedAnswers.map(a => {
        const answer = { ...a }
        answer.isCurrentAccountAnswer = false
        if (answer.answer === 'other_answer') answer.numberOfVotes = answer.numberOfVotes - 1
        if (answer.answer === 'any_answer') {
          answer.isCurrentAccountAnswer = true
          answer.numberOfVotes = answer.numberOfVotes + 1
        }
        return answer
      })

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalNumberOfVotes: 3,
        didAnswer: true
      })

      updatedSurvey = await saveSurveyVoteAndUpdateSurvey.saveAndUpdate(
        survey.id,
        'any_answer',
        'any_answer',
        account.user.id
      )

      expect(updatedSurvey).toEqual({
        ...survey,
        answers: expectedAnswers,
        totalNumberOfVotes: 3,
        didAnswer: true
      })
    })
  })
})
