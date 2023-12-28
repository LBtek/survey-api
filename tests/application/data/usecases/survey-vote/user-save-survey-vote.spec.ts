import { type AnswerToUserContext } from '@/domain/models'
import { UserSaveSurveyVoteRepositorySpy, UpdateSurveyRepositorySpy } from '#/application/data/mocks/repository-mocks'
import { mockUserSaveSurveyVoteParams, mockSurvey } from '#/domain/mocks/models'
import { UserSaveSurveyVote } from '@/application/data/usecases/survey-vote'

const surveyMocked = mockSurvey()
const saveSurveyVoteData = mockUserSaveSurveyVoteParams()

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
  sut: UserSaveSurveyVote
  saveSurveyVoteRepositorySpy: UserSaveSurveyVoteRepositorySpy
  updateSurveyRepositorySpy: UpdateSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyVoteRepositorySpy = new UserSaveSurveyVoteRepositorySpy()
  const updateSurveyRepositorySpy = new UpdateSurveyRepositorySpy()
  const sut = new UserSaveSurveyVote(saveSurveyVoteRepositorySpy, updateSurveyRepositorySpy)
  return {
    sut,
    saveSurveyVoteRepositorySpy,
    updateSurveyRepositorySpy
  }
}

describe('UserSaveSurveyVote UseCase', () => {
  test('Should call UserSaveSurveyVote repository with correct values', async () => {
    const { sut, saveSurveyVoteRepositorySpy } = makeSut()
    await sut.save(saveSurveyVoteData)
    expect(saveSurveyVoteRepositorySpy.saveSurveyVoteData).toEqual(saveSurveyVoteData)
  })

  test('Should call UpdateSurveyRepository with correct values', async () => {
    const { sut, updateSurveyRepositorySpy } = makeSut()
    await sut.save(saveSurveyVoteData)
    expect(updateSurveyRepositorySpy.oldSurvey).toEqual(surveyMocked)
    expect(updateSurveyRepositorySpy.oldAnswer).toBeUndefined()
    expect(updateSurveyRepositorySpy.newAnswer).toBe(saveSurveyVoteData.answer)
  })

  test('Should return an updated Survey on success', async () => {
    const { sut, saveSurveyVoteRepositorySpy, updateSurveyRepositorySpy } = makeSut()
    const updatedSurveyRef = new UpdatedSurveyReference(updateSurveyRepositorySpy)
    updatedSurveyRef.updatedSurvey = await sut.save(saveSurveyVoteData)
    const surveyId = saveSurveyVoteData.surveyId

    let expectedAnswers = surveyMocked.answers.map((a: AnswerToUserContext) => {
      const newAnswer = { ...a }
      newAnswer.percent = 0
      newAnswer.isCurrentAccountAnswer = false
      if (a.answer === saveSurveyVoteData.answer) {
        newAnswer.numberOfVotes = 1
        newAnswer.percent = 100
        newAnswer.isCurrentAccountAnswer = true
      }
      return newAnswer
    })

    expect(updatedSurveyRef.updatedSurvey).toEqual({
      ...surveyMocked,
      answers: expectedAnswers,
      totalNumberOfVotes: 1,
      didAnswer: true
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      userId: 'other_user_id',
      answer: 'other_answer',
      date: new Date()
    })

    expectedAnswers = surveyMocked.answers.map((a: AnswerToUserContext) => {
      const newAnswer = { ...a }
      newAnswer.numberOfVotes = 1
      newAnswer.percent = 50
      newAnswer.isCurrentAccountAnswer = false
      if (a.answer === 'other_answer') { newAnswer.isCurrentAccountAnswer = true }
      return newAnswer
    })

    expect(updatedSurveyRef.updatedSurvey).toEqual({
      ...surveyMocked,
      answers: expectedAnswers,
      totalNumberOfVotes: 2,
      didAnswer: true
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      userId: 'other_user_id2',
      answer: 'other_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      userId: 'other_user_id3',
      answer: 'other_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      userId: 'other_user_id4',
      answer: 'any_answer',
      date: new Date()
    })

    updatedSurveyRef.updatedSurvey = await sut.save({
      surveyId,
      userId: 'other_user_id5',
      answer: 'other_answer',
      date: new Date()
    })

    const lastVote = {
      surveyId,
      userId: 'other_user_id6',
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
      userId: 'other_user_id6',
      answer: 'any_answer',
      date: new Date()
    })

    expectedAnswers = surveyMocked.answers.map((a: AnswerToUserContext) => {
      const newAnswer = { ...a }
      newAnswer.isCurrentAccountAnswer = false
      if (a.answer === 'any_answer') {
        newAnswer.isCurrentAccountAnswer = true
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
      totalNumberOfVotes: 7,
      didAnswer: true
    })
  })

  test('Should throw if UserSaveSurveyVote repository throws', async () => {
    const { sut, saveSurveyVoteRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyVoteRepositorySpy, 'userSaveVote').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.save(saveSurveyVoteData)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if UpdateSurveyRepository throws', async () => {
    const { sut, updateSurveyRepositorySpy } = makeSut()
    jest.spyOn(updateSurveyRepositorySpy, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.save(saveSurveyVoteData)
    await expect(promise).rejects.toThrow()
  })
})
