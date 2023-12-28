import { type IP } from '@/application/entities'
import { type GuestID, type Guest, type GuestAgentID } from '../entities'

export namespace SaveGuestModel {
  export type Params = { ip: IP } & Omit<Guest.BaseDataModel.Body, 'firstIp' | 'currentIp' | 'created_at' | 'updated_at'>
  export type Result = { status: 'Added a new guest' | 'Updated guest', guestId: GuestID, guestAgentId: GuestAgentID }
}
