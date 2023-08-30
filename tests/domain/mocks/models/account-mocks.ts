import { type AddUserAccountModel } from '@/domain/models'
import { type AuthParams } from '@/presentation/protocols'
import { type AccountRepository } from '@/application/data/protocols/repositories/account-repository'

const ip = 'any_ip'
const email = 'any_email@mail.com'
const userName = 'any_name'

export const mockAuthenticationParams = (): AuthParams => ({
  ip,
  email,
  password: 'any_password'
})

export const mockAddAccountParams = (): AddUserAccountModel.Params => ({
  name: userName,
  ...mockAuthenticationParams()
})

export const mockAccount = (): AccountRepository.LoadUserAccountByEmail.Result => ({
  accountId: 'any_account_id',
  user: {
    id: 'any_user_id',
    name: userName,
    email
  },
  password: 'hash'
})
