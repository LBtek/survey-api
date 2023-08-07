export class AnswersInstanceTypeError extends Error {
  constructor () {
    super('Survey answers must be an array')
    this.name = 'AnswersInstanceTypeError'
  }
}
