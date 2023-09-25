export class InvalidTokenPayload extends Error {
  constructor () {
    super('Invalid token payload')
    this.name = 'InvalidTokenPayload'
  }
}
