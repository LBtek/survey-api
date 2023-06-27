export interface LogErrorRepository {
  logError: (stack: string, typeError: 'server' | 'auth') => Promise<void>
}
