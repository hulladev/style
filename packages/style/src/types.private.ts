export type ClassNameNonRecursive = string | string[] | null | undefined | false | true | boolean | 0 | 0n | typeof NaN

// This is useful so stuff like Omit<T, U> shows just like { prop: something }
export type Simplify<T> = { [K in keyof T]: T[K] } & {}
