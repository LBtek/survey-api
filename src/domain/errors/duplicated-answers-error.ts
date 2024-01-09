export class DuplicatedAnswersError extends Error {
  constructor () {
    super('There cannot be duplicate answers')
    this.name = 'DuplicatedAnswersError'
  }
}
