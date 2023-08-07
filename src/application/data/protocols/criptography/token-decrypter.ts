export interface TokenDecrypter {
  decrypt: (token: string) => Promise<any>
}
