import { type IP } from '@/application/entities'
import { type Email } from '../value-objects'

export type GuestAgentID = string
export type GuestID = string

export namespace Guest {
  export type Model = { id: GuestID } & BaseDataModel.Body

  export namespace BaseDataModel {
    export type Body = {
      guestAgentId: GuestAgentID
      name?: string
      email?: Email
      firstIp: IP
      currentIp: IP
      userAgent: string
      created_at: Date
      updated_at: Date
    }
  }
}
