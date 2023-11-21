/* istanbul ignore file */

/**
 * @deprecated
 * This class is not used anymore
 *
 * Now the zod library is used for this type of validation.
 */
export class AnswersInstanceTypeError extends Error {
  constructor () {
    super('Survey answers must be an array')
    this.name = 'AnswersInstanceTypeError'
  }
}
