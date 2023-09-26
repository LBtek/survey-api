export type LogTypeError = 'server' | 'auth'

export interface ILogErrorRepository {
  logError: (stack: string, typeError: LogTypeError) => Promise<void>
}
