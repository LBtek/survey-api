import { type SaveGuestModel } from '@/domain/models'

export interface ISaveGuest {
  save: (data: SaveGuestModel.Params) => Promise<SaveGuestModel.Result>
}
