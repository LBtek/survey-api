import { type AddUserAccount } from '@/domain/models'
import { type AuthParams } from '@/presentation/protocols'
import { type AccountRepository } from '@/application/data/protocols/repositories/account-repository'

const email = 'any_email@mail.com'
const userName = 'any_name'

export const mockAuthenticationParams = (): AuthParams => ({
  email,
  password: 'any_password'
})

export const mockAddAccountParams = (): AddUserAccount.Params => ({
  name: userName,
  ...mockAuthenticationParams()
})

export const mockAccount = (): AccountRepository.LoadUserAccountByEmail.Result => ({
  accountId: 'any_account_id',
  user: {
    userId: 'any_user_id',
    name: userName,
    email
  },
  password: 'hash'
})
