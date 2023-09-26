export interface IHashComparer {
  compare: (value: string, valueToCompare: string) => Promise<boolean>
}
