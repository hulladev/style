export type Variants = Record<string, string>
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type Compose = <const CS extends any[] = ClassName[]>(...classes: CS) => string
type Fn = (...args: any[]) => any
/* eslint-enable  @typescript-eslint/no-explicit-any */
export type ClassName = string | null | undefined | false | 0 | 0n | typeof NaN

export type Config<V extends Variants, DV extends keyof V, B extends string, C extends Compose> = {
  variants?: V
  defaultVariant?: DV
  base?: B
  compose?: C
  transform?: Transform
}

export type Props<V extends Variants> = {
  variant?: keyof V
  class?: string
  className?: string
  "class:list"?: string[]
}

type Incorrect<
  S extends
    string = "[@hulla/style]: Invalid style configuration passed. Refer to https://hulla.dev/docs/style for help",
> = S

export type VariantProps<S> = S extends Fn
  ? Parameters<S>[0] extends Props<infer V>
    ? {
        variant?: keyof V
      }
    : Incorrect
  : Incorrect

export type Variant<S> = S extends Fn ? (Parameters<S>[0] extends Props<infer V> ? keyof V : Incorrect) : Incorrect

export type Transform = (css: string) => string

export type Setup<C extends Compose> = {
  compose?: C
  transform?: (css: string) => string
}

export type StyleFunctions = {
  cn: Compose
  vn: <V extends Variants, DV extends keyof V, B extends string>(
    config: Config<V, DV, B, Compose>
  ) => (props: Props<V>) => string
}
