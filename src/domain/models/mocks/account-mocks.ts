import { type AccountModel } from '../account'
import { type AddAccountParams } from '../../usecases/account/add-account'
import { type AuthParams } from '../../usecases/account/authentication'

export const mockAuthenticationParams = (): AuthParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  ...mockAuthenticationParams()
})

export const mockAccount = (): AccountModel => ({
  id: 'any_id',
  ...mockAddAccountParams(),
  password: 'hash'
})
