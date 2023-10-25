declare module Express {
  interface Request {
    userId?: string
    accountId?: string
    role?: string
    newAccessToken?: string
  }
}
