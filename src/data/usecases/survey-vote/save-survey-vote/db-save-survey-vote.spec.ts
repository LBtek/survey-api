import { DbSaveSurveyVote } from './db-save-survey-vote'
import { SaveSurveyVoteRepositorySpy, UpdateSurveyRepositorySpy } from '@/data/mocks'
import { mockSaveSurveyVoteParams, mockSurvey } from '@/domain/models/mocks'

const surveyMocked = mockSurvey()
const saveSurveyVoteData = mockSaveSurveyVoteParams()

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
  sut: DbSaveSurveyVote
  saveSurveyVoteRepositorySpy: SaveSurveyVoteRepositorySpy
  updateSurveyRepositorySpy: UpdateSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyVoteRepositorySpy = new SaveSurveyVoteRepositorySpy()
  const updateSurveyRepositorySpy = new UpdateSurveyRepositorySpy()
  const sut = new DbSaveSurveyVote(saveSurveyVoteRepositorySpy, updateSurveyRepositorySpy)
  return {
    sut,
    saveSurveyVoteRepositorySpy,
    updateSurveyRepositorySpy
  }
}

describe('DbSaveSurveyVote UseCase', () => {
  test('Should call SaveSurveyVoteRepository with correct values', async () => {
    const { sut, saveSurveyVoteRepositorySpy } = makeSut()
    await sut.save(saveSurveyVoteData)
    expect(saveSurveyVoteRepositorySpy.saveSurveyVoteData).toEqual(saveSurveyVoteData)
  })

  test('Should call UpdateSurveyRepository with correct values', async () => {
    const { sut, updateSurveyRepositorySpy } = makeSut()
    await sut.save(saveSurveyVoteData)
    expect(updateSurveyRepositorySpy.oldSurvey).toEqual(surveyMocked)
    expect(updateSurveyRepositorySpy.oldAnswer).toBeNull()
    expect(updateSurveyRepositorySpy.newAnswer).toBe(saveSurveyVoteData.answer)
  })

  test('Should return an updated Survey on success', async () => {
    const { sut, saveSurveyVoteRepositorySpy, updateSurveyRepositorySpy } = makeSut()
    const updatedSurveyRef = new UpdatedSurveyReference(updateSurveyRepositorySpy)
    updatedSurveyRef.updatedSurvey = await sut.save(saveSurveyVoteData)
    const surveyId = saveSurveyVoteData.surveyId

    let expectedAnswers = surveyMocked.answers.map(a => {
      const newAnswer = { ...a }
      newAnswer.percent = 0
      if (a.answer === saveSurveyVoteData.answer) {
        newAnswer.amountVotes = 1
        newAnswer.percent = 100
      }
      return newAnswer
    })

    expect(updatedSurveyRef.updatedSurvey).toEqual({
      ...surveyMocked,
      answers: expectedAnswers,
      totalAmountVotes: 1
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      accountId: 'other_account_id',
      answer: 'other_answer',
      date: new Date()
    })

    expectedAnswers = surveyMocked.answers.map(a => {
      const newAnswer = { ...a }
      newAnswer.amountVotes = 1
      newAnswer.percent = 50
      return newAnswer
    })

    expect(updatedSurveyRef.updatedSurvey).toEqual({
      ...surveyMocked,
      answers: expectedAnswers,
      totalAmountVotes: 2
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      accountId: 'other_account_id2',
      answer: 'other_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      accountId: 'other_account_id3',
      answer: 'other_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      accountId: 'other_account_id4',
      answer: 'any_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      accountId: 'other_account_id5',
      answer: 'other_answer',
      date: new Date()
    })

    const lastVote = {
      surveyId,
      accountId: 'other_account_id6',
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
      accountId: 'other_account_id6',
      answer: 'any_answer',
      date: new Date()
    })

    expectedAnswers = surveyMocked.answers.map(a => {
      const newAnswer = { ...a }
      if (a.answer === 'any_answer') {
        newAnswer.amountVotes = 3
        newAnswer.percent = 42.86
      }
      if (a.answer === 'other_answer') {
        newAnswer.amountVotes = 4
        newAnswer.percent = 57.14
      }
      return newAnswer
    })

    expect(updatedSurveyRef.updatedSurvey).toEqual({
      ...surveyMocked,
      answers: expectedAnswers,
      totalAmountVotes: 7
    })
  })

  test('Should throw if SaveSurveyVoteRepository throws', async () => {
    const { sut, saveSurveyVoteRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyVoteRepositorySpy, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.save(saveSurveyVoteData)
    await expect(promisse).rejects.toThrow()
  })

  test('Should throw if UpdateSurveyRepository throws', async () => {
    const { sut, updateSurveyRepositorySpy } = makeSut()
    jest.spyOn(updateSurveyRepositorySpy, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const promisse = sut.save(saveSurveyVoteData)
    await expect(promisse).rejects.toThrow()
  })
})
