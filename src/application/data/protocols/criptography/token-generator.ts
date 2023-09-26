export interface ITokenGenerator {
  generate: (payload: object) => Promise<string>
}
