declare module Express {
  interface Request {
    userId?: string
    accountId?: string
    newAccessToken?: string
  }
}
