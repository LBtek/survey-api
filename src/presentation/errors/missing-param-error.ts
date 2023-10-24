export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing required field: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
