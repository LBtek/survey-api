import { ObjectId } from 'mongodb'
import { MongoHelper } from './helpers/mongo-helper'
import {
  type GuestRepository,
  type ILoadGuestsByAgentIdRepository,
  type ISaveGuestRepository
} from '@/application/data/protocols/repositories'

export class GuestMongoRepository implements ILoadGuestsByAgentIdRepository, ISaveGuestRepository {
  async save (data: GuestRepository.SaveGuest.Params): Promise<GuestRepository.SaveGuest.Result> {
    const guestCollection = await MongoHelper.getCollection('guests')
    let guest
    if (typeof data.id === 'string' && data.id.trim().length) {
      const { id, ...rest } = data
      guest = await guestCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...rest } },
        { upsert: false, returnDocument: 'after' }
      )
      if (guest.value && guest.ok) return MongoHelper.mapOneDocumentWithId(guest.value)
    } else {
      const { id, ...rest } = data
      guest = await guestCollection.insertOne(rest)
      if (guest && guest.insertedId) return MongoHelper.mapInsertOneResult(guest, rest)
    }
  }

  async loadByAgentId (data: GuestRepository.LoadGuestsByAgentId.Params): Promise<GuestRepository.LoadGuestsByAgentId.Result> {
    const guestCollection = await MongoHelper.getCollection('guests')
    const guestAgentId = data.guestAgentId
    const email = data.email
    const guests = await guestCollection.find({ $or: [{ guestAgentId }, { email }] }).toArray()

    return MongoHelper.mapManyDocumentsWithId(guests)
  }
}
