export class AnswersLengthError extends Error {
  constructor () {
    super('Answers must not be empty')
    this.name = 'AnswersLengthError'
  }
}
