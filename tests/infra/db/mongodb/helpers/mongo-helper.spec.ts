import env from '@/main/config/env'
import { MongoHelper as sut } from '@/infra/db/mongodb/helpers/mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(env.mongodb.url)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
