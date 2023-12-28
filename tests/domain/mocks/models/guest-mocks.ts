import { type Guest } from '@/domain/entities'
import { type SaveGuestModel } from '@/domain/models'

const date = new Date()
const otherDate = new Date(date.getTime() + 2000)

export const mockSaveGuestParams = (): SaveGuestModel.Params => ({
  ip: 'any_ip',
  guestAgentId: 'any_guest_agent_id',
  userAgent: 'any'
})

const { ip, ...rest } = mockSaveGuestParams()

export const mockGuest = (): Guest.Model => ({
  id: 'any_id',
  ...rest,
  name: 'any_name',
  email: 'any_email',
  firstIp: 'any_ip',
  currentIp: 'any_ip',
  created_at: date,
  updated_at: date
})

export const mockLoadGuestsByAgentId = (): Guest.Model[] => {
  const guests = [mockGuest(), mockGuest()]
  guests[1].id = 'other_guest_id'
  guests[1].name = 'other_name'
  guests[1].email = 'other_email'
  guests[1].created_at = otherDate
  guests[1].updated_at = otherDate

  return guests
}
