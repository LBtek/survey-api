import { type Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LogMongoRepository } from '@/infra/db/mongodb/log'
import env from '@/main/config/env'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongodb.url)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('server_errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on sucess', async () => {
    const sut = makeSut()
    await sut.logError('any_error', 'server')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
