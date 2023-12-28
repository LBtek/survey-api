import { type Collection } from 'mongodb'
import { type SaveGuestModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { mockAddSurveyRepositoryParams } from '#/domain/mocks/models'
import { GuestSurveyVoteMongoRepository } from '@/infra/db/mongodb/guest-survey-vote-mongo-repository'
import { makeSaveGuestUsecase } from '@/main/factories/usecases/guest/save-guest-factory'
import env from '@/main/config/env'

let surveyCollection: Collection
let guestSurveyVoteCollection: Collection
let guestCollection: Collection

const makeSut = (): GuestSurveyVoteMongoRepository => {
  return new GuestSurveyVoteMongoRepository()
}

const makeSurvey = async (): Promise<any> => {
  const res = await surveyCollection.insertOne(mockAddSurveyRepositoryParams())
  return MongoHelper.mapInsertOneResult(res, mockAddSurveyRepositoryParams())
}

const makeGuest = async (): Promise<SaveGuestModel.Result> => {
  const saveGuest = makeSaveGuestUsecase()
  const guest = await saveGuest.save({
    ip: 'any_ip',
    userAgent: 'any',
    guestAgentId: null,
    email: 'any_email',
    name: 'any_name'
  })

  return guest
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
    guestSurveyVoteCollection = await MongoHelper.getCollection('guestSurveyVotes')
    await guestSurveyVoteCollection.deleteMany({})
    guestCollection = await MongoHelper.getCollection('guests')
    await guestCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey vote if its new', async () => {
      const sut = makeSut()
      const { guestId, guestAgentId } = await makeGuest()
      const survey = await makeSurvey()
      const surveyVote = await sut.guestSaveVote({
        guestId,
        guestAgentId,
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyVote).toBeUndefined()
    })

    test('Should update survey vote if its not new', async () => {
      const sut = makeSut()
      const { guestId, guestAgentId } = await makeGuest()
      const survey = await makeSurvey()
      const oldData = {
        guestId,
        guestAgentId,
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        date: new Date()
      }
      await sut.guestSaveVote(oldData)
      const newData = {
        guestId,
        guestAgentId,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date()
      }
      const surveyVote = await sut.guestSaveVote(newData)
      expect(surveyVote).toBeTruthy()
      expect(surveyVote.id).toBeTruthy()
      expect(surveyVote.answer).toBe(oldData.answer)
      expect(surveyVote.date).toEqual(oldData.date)
    })
  })
})
