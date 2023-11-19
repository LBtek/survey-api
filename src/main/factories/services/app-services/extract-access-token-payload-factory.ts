import { type IExtractAccessTokenPayloadService } from '@/presentation/protocols'
import { ExtractAccessTokenPayload } from '@/application/data/services'
import { InMemoryAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/authenticated-user-accounts-repository'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeExtractAccessTokenPayloadService = (): IExtractAccessTokenPayloadService => {
  const tokenDecrypter = new JwtAdapter(env.api.jwtSecret)
  const deleteAccessTokenRepositoy = new InMemoryAuthenticatedUserAccountsRepository()
  return new ExtractAccessTokenPayload(tokenDecrypter, deleteAccessTokenRepositoy)
}
