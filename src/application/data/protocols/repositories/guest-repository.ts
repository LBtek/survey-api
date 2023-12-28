import { type Guest } from '@/domain/entities'

export namespace GuestRepository {
  export namespace SaveGuest {
    export type Params = { id?: string } & Guest.BaseDataModel.Body
    export type Result = Guest.Model
  }

  export namespace LoadGuestsByAgentId {
    export type Params = Pick<Guest.BaseDataModel.Body, 'guestAgentId' | 'email'>
    export type Result = Guest.Model[]
  }
}

export interface ISaveGuestRepository {
  save: (data: GuestRepository.SaveGuest.Params) => Promise<GuestRepository.SaveGuest.Result>
}

export interface ILoadGuestsByAgentIdRepository {
  loadByAgentId: (data: GuestRepository.LoadGuestsByAgentId.Params) => Promise<GuestRepository.LoadGuestsByAgentId.Result>
}
