export class AnswerFormatError extends Error {
  constructor () {
    super('Each answer must be in the format: { image?: string, answer: string! }')
    this.name = 'AnswerFormatError'
  }
}
