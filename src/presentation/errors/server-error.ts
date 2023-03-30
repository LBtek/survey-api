export class ServerError extends Error {
  constructor (stack: string | null | undefined = undefined) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
