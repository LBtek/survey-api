export namespace Account {
  export namespace BaseDataModel {
    export type Body = {
      userId: string
      password: string
      accessToken?: string
      role?: Roles
    }

    export type Roles = 'admin' | 'publisher'
  }
}
