export class DuplicatedAnswersError extends Error {
  constructor () {
    super('There can be no duplicate answers or images')
    this.name = 'DuplicatedAnswersError'
  }
}
