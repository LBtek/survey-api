import { type Survey } from '@/domain/entities'
import { GuestSaveSurveyVote } from '@/application/data/usecases/survey-vote'
import { GuestSaveSurveyVoteRepositorySpy, UpdateSurveyRepositorySpy } from '../../mocks/repository-mocks'
import { mockGuestSaveSurveyVoteParams, mockSurvey } from '#/domain/mocks/models'

type Answer = Survey.BaseDataModel.BaseAnswer & { percent: number }

class UpdatedSurveyReference {
  #updatedSurvey = {}

  constructor (private readonly updateSurveyRepositorySpy: UpdateSurveyRepositorySpy) { }

  get updatedSurvey (): any {
    return this.#updatedSurvey
  }

  set updatedSurvey (newSurvey) {
    this.#updatedSurvey = newSurvey
    this.updateSurveyRepositorySpy.oldSurvey = newSurvey
  }
}

type SutTypes = {
  sut: GuestSaveSurveyVote
  saveSurveyVoteRepositorySpy: GuestSaveSurveyVoteRepositorySpy
  updateSurveyRepositorySpy: UpdateSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyVoteRepositorySpy = new GuestSaveSurveyVoteRepositorySpy()
  const updateSurveyRepositorySpy = new UpdateSurveyRepositorySpy()
  const sut = new GuestSaveSurveyVote(saveSurveyVoteRepositorySpy, updateSurveyRepositorySpy)

  return {
    sut,
    saveSurveyVoteRepositorySpy,
    updateSurveyRepositorySpy
  }
}

describe('GuestSaveSurveyVote UseCase', () => {
  test('Should call GuestSaveSurveyVote repository with correct values', async () => {
    const { sut, saveSurveyVoteRepositorySpy } = makeSut()
    const params = mockGuestSaveSurveyVoteParams()
    await sut.save(params)
    expect(saveSurveyVoteRepositorySpy.saveSurveyVoteData).toEqual(params)
  })

  test('Should call UpdateSurveyRepository with correct values', async () => {
    const { sut, updateSurveyRepositorySpy } = makeSut()
    const params = mockGuestSaveSurveyVoteParams()
    await sut.save(params)
    expect(updateSurveyRepositorySpy.oldSurvey).toEqual(mockSurvey())
    expect(updateSurveyRepositorySpy.oldAnswer).toBeUndefined()
    expect(updateSurveyRepositorySpy.newAnswer).toBe(params.answer)
  })

  test('Should return an updated Survey on success', async () => {
    const { sut, saveSurveyVoteRepositorySpy, updateSurveyRepositorySpy } = makeSut()
    const updatedSurveyRef = new UpdatedSurveyReference(updateSurveyRepositorySpy)
    const params = mockGuestSaveSurveyVoteParams()
    updatedSurveyRef.updatedSurvey = await sut.save(params)
    const surveyMocked = mockSurvey()
    const surveyId = params.surveyId

    let expectedAnswers = surveyMocked.answers.map((a: Answer) => {
      const newAnswer = { ...a }
      newAnswer.percent = 0
      if (a.answer === params.answer) {
        newAnswer.numberOfVotes = 1
        newAnswer.percent = 100
      }
      return newAnswer
    })

    expect(updatedSurveyRef.updatedSurvey).toEqual({
      ...surveyMocked,
      answers: expectedAnswers,
      totalNumberOfVotes: 1
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      guestId: 'other_guest_id',
      guestAgentId: 'any_guest_agent_id',
      answer: 'other_answer',
      date: new Date()
    })

    expectedAnswers = surveyMocked.answers.map((a: Answer) => {
      const newAnswer = { ...a }
      newAnswer.numberOfVotes = 1
      newAnswer.percent = 50
      return newAnswer
    })

    expect(updatedSurveyRef.updatedSurvey).toEqual({
      ...surveyMocked,
      answers: expectedAnswers,
      totalNumberOfVotes: 2
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      guestId: 'other_guest_id2',
      guestAgentId: 'any_guest_agent_id',
      answer: 'other_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      guestId: 'other_guest_id3',
      guestAgentId: 'any_guest_agent_id',
      answer: 'other_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      guestId: 'other_guest_id4',
      guestAgentId: 'any_guest_agent_id',
      answer: 'any_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      guestId: 'other_guest_id5',
      guestAgentId: 'any_guest_agent_id',
      answer: 'other_answer',
      date: new Date()
    })

    const lastVote = {
      surveyId,
      guestId: 'other_guest_id6',
      guestAgentId: 'any_guest_agent_id',
      answer: 'other_answer',
      date: new Date()
    }

    updatedSurveyRef.updatedSurvey = await sut.save(lastVote)

    saveSurveyVoteRepositorySpy.oldSurveyVote = {
      id: 'any_id',
      ...lastVote
    }

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      guestId: 'other_guest_id6',
      guestAgentId: 'any_guest_agent_id',
      answer: 'any_answer',
      date: new Date()
    })

    expectedAnswers = surveyMocked.answers.map((a: Answer) => {
      const newAnswer = { ...a }
      if (a.answer === 'any_answer') {
        newAnswer.numberOfVotes = 3
        newAnswer.percent = 42.86
      }
      if (a.answer === 'other_answer') {
        newAnswer.numberOfVotes = 4
        newAnswer.percent = 57.14
      }
      return newAnswer
    })

    expect(updatedSurveyRef.updatedSurvey).toEqual({
      ...surveyMocked,
      answers: expectedAnswers,
      totalNumberOfVotes: 7
    })
  })

  test('Should throw if GuestSaveSurveyVote repository throws', async () => {
    const { sut, saveSurveyVoteRepositorySpy } = makeSut()
    saveSurveyVoteRepositorySpy.guestSaveVote = () => { throw new Error() }
    const promise = sut.save(mockGuestSaveSurveyVoteParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if UpdateSurveyRepository throws', async () => {
    const { sut, updateSurveyRepositorySpy } = makeSut()
    updateSurveyRepositorySpy.update = () => { throw new Error() }
    const promise = sut.save(mockGuestSaveSurveyVoteParams())
    await expect(promise).rejects.toThrow()
  })
})
