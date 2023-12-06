import { type IExtractAccessTokenPayloadService } from '@/presentation/protocols'
import { ExtractAccessTokenPayload } from '@/application/data/services'
import { RedisAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/redis'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeExtractAccessTokenPayloadService = (): IExtractAccessTokenPayloadService => {
  const tokenDecrypter = new JwtAdapter(env.api.jwtSecret)
  const deleteAccessTokenRepositoy = new RedisAuthenticatedUserAccountsRepository()
  return new ExtractAccessTokenPayload(tokenDecrypter, deleteAccessTokenRepositoy)
}
