import { type ISaveGuest } from '@/domain/usecases/guest-context'
import { SaveGuest } from '@/application/data/usecases/guest/save-guest'
import { GuestMongoRepository } from '@/infra/db/mongodb/guest-mongo-repository'

export const makeSaveGuestUsecase = (): ISaveGuest => {
  const guestMongoRepository = new GuestMongoRepository()
  return new SaveGuest(guestMongoRepository, guestMongoRepository)
}
