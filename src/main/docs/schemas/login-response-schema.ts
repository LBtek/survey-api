export const loginResponseSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string'
    },
    username: {
      type: 'string'
    }
  }
}
