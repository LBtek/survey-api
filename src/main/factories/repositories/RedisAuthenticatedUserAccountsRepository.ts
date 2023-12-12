import { RedisAuthenticatedUserAccountsRepository } from '@/infra/db/in-memory/redis'

export const authenticatedUserAccountsRepository = new RedisAuthenticatedUserAccountsRepository()
