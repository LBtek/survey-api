import { type Collection } from 'mongodb'
import { type AccountRepository } from '@/application/data/protocols/repositories/account-repository'
import { SurveyVoteMongoRepository } from '@/infra/db/mongodb/survey-vote-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { mockAddAccountParams, mockAddSurveyRepositoryParams } from '#/domain/mocks/models'
import env from '@/main/config/env'

let surveyCollection: Collection
let surveyVoteCollection: Collection
let accountCollection: Collection
let userCollection: Collection

const makeSut = (): SurveyVoteMongoRepository => {
  return new SurveyVoteMongoRepository()
}

const makeSurvey = async (): Promise<any> => {
  const res = await surveyCollection.insertOne(mockAddSurveyRepositoryParams())
  return MongoHelper.mapInsertOneResult(res, mockAddSurveyRepositoryParams())
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

  describe('save()', () => {
    test('Should add a survey vote if its new', async () => {
      const sut = makeSut()
      const account = await makeAccount()
      const survey = await makeSurvey()
      const surveyVote = await sut.save({
        surveyId: survey.id,
        userId: account.user.id,
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
        userId: account.user.id,
        answer: survey.answers[1].answer,
        date: new Date()
      }
      await sut.save(oldData)
      const newData = {
        surveyId: survey.id,
        userId: account.user.id,
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
