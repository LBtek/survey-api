import { SaveGuest } from '@/application/data/usecases/guest/save-guest'
import { LoadGuestsByAgentIdRepositorySpy, SaveGuestRepositorySpy } from '../../mocks/repository-mocks'
import { mockLoadGuestsByAgentId, mockSaveGuestParams } from '#/domain/mocks/models'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveGuest
  saveGuestRepositorySpy: SaveGuestRepositorySpy
  loadGuestsByAgentIdRepositorySpy: LoadGuestsByAgentIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveGuestRepositorySpy = new SaveGuestRepositorySpy()
  const loadGuestsByAgentIdRepositorySpy = new LoadGuestsByAgentIdRepositorySpy()
  const sut = new SaveGuest(saveGuestRepositorySpy, loadGuestsByAgentIdRepositorySpy)

  return {
    sut,
    saveGuestRepositorySpy,
    loadGuestsByAgentIdRepositorySpy
  }
}

const date = new Date()

describe('SaveGuest Usecase', () => {
  beforeAll(() => {
    MockDate.set(date)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call loadGuestsByAgentId repository with correct values if guestAgentId is provided', async () => {
    const { sut, loadGuestsByAgentIdRepositorySpy } = makeSut()
    await sut.save(mockSaveGuestParams())
    expect(loadGuestsByAgentIdRepositorySpy.loadDataParams.guestAgentId).toBe('any_guest_agent_id')
    expect(loadGuestsByAgentIdRepositorySpy.loadDataParams.email).toBeFalsy()
    await sut.save({
      ...mockSaveGuestParams(),
      name: 'any_name',
      email: 'any_email'
    })
    expect(loadGuestsByAgentIdRepositorySpy.loadDataParams.email).toBe('any_email')
  })

  test('Should call SaveGuest repository with correct values when adding a new guest', async () => {
    const { sut, saveGuestRepositorySpy, loadGuestsByAgentIdRepositorySpy } = makeSut()
    const saveParams = mockSaveGuestParams()
    const guestAgentId = saveParams.guestAgentId
    const { ip, ...rest } = saveParams

    saveParams.guestAgentId = null
    const guestAdded = await sut.save(saveParams)
    expect(saveGuestRepositorySpy.saveDataParams).toEqual({
      ...rest,
      guestAgentId: guestAdded.guestAgentId,
      name: undefined,
      email: undefined,
      firstIp: ip,
      currentIp: ip,
      created_at: date,
      updated_at: date
    })

    loadGuestsByAgentIdRepositorySpy.guests = loadGuestsByAgentIdRepositorySpy.guests.map((guest) => {
      const g = { ...guest }
      g.email = undefined
      return g
    })

    saveParams.guestAgentId = guestAgentId
    await sut.save(saveParams)
    expect(saveGuestRepositorySpy.saveDataParams).toEqual({
      ...rest,
      name: undefined,
      email: undefined,
      firstIp: ip,
      currentIp: ip,
      created_at: date,
      updated_at: date
    })

    loadGuestsByAgentIdRepositorySpy.guests = loadGuestsByAgentIdRepositorySpy.guests.map((guest) => {
      const g = { ...guest }
      g.name = undefined
      return g
    })
    await sut.save(saveParams)
  })

  test('Should call SaveGuest repository with correct values when updating a guest', async () => {
    const { sut, saveGuestRepositorySpy } = makeSut()
    await sut.save({
      ...mockSaveGuestParams(),
      email: 'other_email',
      name: 'any_name'
    })

    expect(saveGuestRepositorySpy.saveDataParams).toEqual({
      ...mockLoadGuestsByAgentId()[1],
      name: 'any_name',
      updated_at: date
    })

    await sut.save({
      ...mockSaveGuestParams(),
      email: 'any_email'
    })

    expect(saveGuestRepositorySpy.saveDataParams).toEqual({
      ...mockLoadGuestsByAgentId()[0],
      updated_at: date
    })
  })

  test('Should throw if LoadGuestsByAgentId repository throws', async () => {
    const { sut, loadGuestsByAgentIdRepositorySpy } = makeSut()
    loadGuestsByAgentIdRepositorySpy.loadByAgentId = async () => { throw new Error() }
    const promise = sut.save(mockSaveGuestParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if SaveGuestRepository throws', async () => {
    const { sut, saveGuestRepositorySpy } = makeSut()
    saveGuestRepositorySpy.save = async () => { throw new Error() }
    const promise = sut.save(mockSaveGuestParams())
    await expect(promise).rejects.toThrow()
  })
})
