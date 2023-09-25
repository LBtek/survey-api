import { type Account } from '@/application/entities'

export const setOfAllRoles = new Set<Account.BaseDataModel.Roles>()
  .add('basic_user')
  .add('publisher')
  .add('admin')
