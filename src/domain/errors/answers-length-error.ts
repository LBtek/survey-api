export class AnswersLengthError extends Error {
  constructor () {
    super('Must have at least two answer options')
    this.name = 'AnswersLengthError'
  }
}
