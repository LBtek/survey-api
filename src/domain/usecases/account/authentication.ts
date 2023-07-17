import { type AuthenticationModel } from '@/domain/models/authentication'

export type AuthParams = {
  email: string
  password: string
}

export interface Authentication {
  auth: (authentication: AuthParams) => Promise<AuthenticationModel>
}
