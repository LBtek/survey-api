export interface IValidation {
  validate: (input: object) => Error | null | undefined
}
