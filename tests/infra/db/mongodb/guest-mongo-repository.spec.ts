import { type Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { GuestMongoRepository } from '@/infra/db/mongodb/guest-mongo-repository'
import env from '@/main/config/env'
import { mockGuest } from '#/domain/mocks/models/guest-mocks'

let guestCollection: Collection

const makeSut = (): GuestMongoRepository => {
  return new GuestMongoRepository()
}

describe('Guest Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongodb.url)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    guestCollection = await MongoHelper.getCollection('guests')
    await guestCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should return a registered guest after successful save', async () => {
      const sut = makeSut()
      const { id, ...rest } = mockGuest()
      const guest = await sut.save(rest)
      expect(guest).toBeTruthy()
      expect(guest.id).toBeTruthy()
      const guestId = guest.id
      const newDate = new Date()
      guest.currentIp = 'other_ip'
      guest.updated_at = newDate

      const updatedGuest = await sut.save(guest)
      expect(updatedGuest).toBeTruthy()
      expect(updatedGuest.id).toBeTruthy()
      expect(updatedGuest.id).toBe(guestId)
      expect(updatedGuest.firstIp).toBe('any_ip')
      expect(updatedGuest.currentIp).toBe('other_ip')
      expect(new Date(updatedGuest.updated_at)).toEqual(newDate)
      expect(updatedGuest.updated_at.toISOString()).toBe(newDate.toISOString())
    })
  })

  describe('loadByAgentId()', () => {
    test('Should load guest by agentId or email on success', async () => {
      const sut = makeSut()
      const { id, ...rest } = mockGuest()
      await sut.save(rest)
      let guest = await sut.loadByAgentId({ guestAgentId: rest.guestAgentId })
      expect(guest.length).toBe(1)
      expect(guest[0].id).toBeTruthy()
      expect(guest[0].guestAgentId).toBe(rest.guestAgentId)

      rest.email = 'other_email'
      rest.guestAgentId = 'other'
      await sut.save(rest)

      guest = await sut.loadByAgentId({ email: rest.email, guestAgentId: 'any' })
      expect(guest.length).toBe(1)
      expect(guest[0].id).toBeTruthy()
      expect(guest[0].email).toBe('other_email')
      expect(guest[0].guestAgentId).toBe('other')
    })
  })
})
