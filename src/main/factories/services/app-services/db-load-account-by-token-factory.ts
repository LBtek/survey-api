import { type LoadUserAccountByTokenService } from '@/presentation/protocols'
import { DbLoadUserByAccountAccessToken } from '@/application/data/services'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository'
import { JwtAdapter } from '@/infra/criptography'
import env from '@/main/config/env'

export const makeDbLoadUserByAccountAccessToken = (): LoadUserAccountByTokenService => {
  const jwtTokenDecrypterAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadUserByAccountAccessToken(jwtTokenDecrypterAdapter, accountMongoRepository)
}
