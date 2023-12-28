import { type SaveGuestModel } from '@/domain/models'
import { type ISaveGuest } from '@/domain/usecases/guest-context'

export class SaveGuestSpy implements ISaveGuest {
  params: SaveGuestModel.Params

  result: SaveGuestModel.Result = {
    status: 'Added a new guest',
    guestId: 'any_guest_id',
    guestAgentId: 'any_guest_agent_id'
  }

  async save (data: SaveGuestModel.Params): Promise<SaveGuestModel.Result> {
    this.params = data
    return this.result
  }
}
