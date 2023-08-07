export type LogTypeError = 'server' | 'auth'

export interface LogErrorRepository {
  logError: (stack: string, typeError: LogTypeError) => Promise<void>
}
