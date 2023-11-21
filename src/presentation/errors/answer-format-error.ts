/* istanbul ignore file */

/**
 * @deprecated
 * This class is not used anymore
 *
 * Now the zod library is used for this type of validation.
 */
export class AnswerFormatError extends Error {
  constructor () {
    super('Each answer must be in the format: { image?: string, answer: string! }')
    this.name = 'AnswerFormatError'
  }
}
