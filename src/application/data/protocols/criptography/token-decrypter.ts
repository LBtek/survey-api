export interface ITokenDecrypter {
  decrypt: (token: string) => Promise<any>
}
