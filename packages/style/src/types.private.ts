import type { Variant, NO_DEFAULT, VariantAPI } from "./types.public"

export type ClassNameNonRecursive = string | string[] | null | undefined | false | true | boolean | 0 | 0n | typeof NaN

// Allow any valid ClassName type (strings, arrays, objects, nested combinations)
export type ClassesDefinition = Record<string, ClassNameNonRecursive | Record<string, any> | any[]>

// This is useful so stuff like Omit<T, U> shows just like { prop: something }
export type Simplify<T> = { [K in keyof T]: T[K] } & {}

export type Props<V extends readonly Variant<any, any, any, any>[]> =
  V[number] extends Variant<infer N, infer VN, NO_DEFAULT, any>
    ? {
        [K in N]: keyof VN
      }
    : V[number] extends Variant<infer N, infer VN, string, any>
      ? {
          [K in N]?: keyof VN
        }
      : {}

export type KeysWithDefault<V extends readonly VariantAPI<any>[]> = {
  [P in V[number]["params"] as P["name"]]: P["default"] extends undefined ? P["name"] : never
}[V[number]["params"]["name"]]

export type KeysWithoutDefault<V extends readonly VariantAPI<any>[]> = {
  [P in V[number]["params"] as P["name"]]: P["default"] extends undefined ? never : P["name"]
}[V[number]["params"]["name"]]

export type GroupProps<V extends readonly VariantAPI<any>[]> = Simplify<
  {
    [P in KeysWithDefault<V>]: keyof Extract<V[number]["params"], { name: P }>["classes"]
  } & {
    [P in KeysWithoutDefault<V>]?: keyof Extract<V[number]["params"], { name: P }>["classes"]
  }
>

export type APIPropsMapper<V extends VariantAPI<any>> =
  V extends VariantAPI<Variant<infer N, infer VN, infer D, any>>
    ? D extends NO_DEFAULT
      ? {
          [K in N]: keyof VN
        }
      : {
          [K in N]?: keyof VN
        }
    : {}
