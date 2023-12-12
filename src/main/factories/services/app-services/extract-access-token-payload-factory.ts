import { type IExtractAccessTokenPayloadService } from '@/presentation/protocols'
import { ExtractAccessTokenPayload } from '@/application/data/services'
import { authenticatedUserAccountsRepository } from '@/main/factories/repositories'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeExtractAccessTokenPayloadService = (): IExtractAccessTokenPayloadService => {
  const tokenDecrypter = new JwtAdapter(env.api.jwtSecret)
  return new ExtractAccessTokenPayload(tokenDecrypter, authenticatedUserAccountsRepository)
}
