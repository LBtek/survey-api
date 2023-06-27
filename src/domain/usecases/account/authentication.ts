export type AuthParams = {
  email: string
  password: string
}

export interface Authentication {
  auth: (authentication: AuthParams) => Promise<string | null>
}
