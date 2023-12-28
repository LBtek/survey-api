declare module Express {
  interface Request {
    userId?: string
    accountId?: string
    role?: string
    filteredData?: any
    newAccessToken?: string
    guestAgentId?: string
  }
}
