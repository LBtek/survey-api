import { type SaveGuestModel } from '@/domain/models'
import { type ISaveGuest as ISaveGuestUsecase } from '@/domain/usecases/guest-context'
import { type ILoadGuestsByAgentIdRepository, type ISaveGuestRepository } from '../../protocols/repositories/guest-repository'
import { UUID } from 'bson'

export class SaveGuest implements ISaveGuestUsecase {
  constructor (
    private readonly saveGuestRepository: ISaveGuestRepository,
    private readonly loadGuestsByAgentIdRepository: ILoadGuestsByAgentIdRepository
  ) { }

  async save (data: SaveGuestModel.Params): Promise<SaveGuestModel.Result> {
    let guestAgentId = data.guestAgentId
    const date = new Date()
    let sameGuest: any
    if (guestAgentId) {
      const guests = await this.loadGuestsByAgentIdRepository.loadByAgentId({ guestAgentId, email: data.email })
      if (guests.length) {
        sameGuest = guests.find((g) => {
          if (g.email) {
            return g.email === data.email
          } else if (g.name) {
            return g.name === data.name
          }
          return false
        })
        if (sameGuest) {
          sameGuest.name = data.name ? data.name : sameGuest.name
          sameGuest.email = data.email
          sameGuest.currentIp = data.ip
          sameGuest.updated_at = date
          const guest = await this.saveGuestRepository.save(sameGuest)

          return { status: 'Updated guest', guestId: guest.id, guestAgentId }
        }
      }
    } else guestAgentId = new UUID().toString()

    if (!sameGuest) {
      const guest = await this.saveGuestRepository.save({
        name: data.name,
        email: data.email,
        userAgent: data.userAgent,
        firstIp: data.ip,
        currentIp: data.ip,
        created_at: date,
        updated_at: date,
        guestAgentId
      })
      return { status: 'Added a new guest', guestId: guest.id, guestAgentId }
    }
  }
}
