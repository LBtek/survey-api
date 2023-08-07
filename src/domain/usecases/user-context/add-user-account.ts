import { type Account } from '@/domain/entities'

export interface AddUserAccount {
  add: (data: Account.AddUserAccount.Params) => Promise<Account.AddUserAccount.Result>
}
