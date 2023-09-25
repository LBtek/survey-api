export interface TokenGenerator {
  generate: (payload: object) => Promise<string>
}
