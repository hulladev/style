import type { HTMLAttributes } from "astro/types"

export type Variants = Record<string, Record<string, string>>
export type Compose = <const CS extends any[] = ClassName[]>(...classes: CS) => string
export type ClassName = string | null | undefined | false | 0 | 0n | typeof NaN

export type Config<
  V extends Variants,
  DV extends {
    [K in keyof V]?: keyof V[K]
  },
  B extends string,
  C extends Compose,
> = {
  props: V
  defaults?: DV
  base?: B
  compose?: C
  transform?: Transform
}

export type BaseProps = {
  class?: string | null
  className?: string | null
  "class:list"?: HTMLAttributes<"div">["class:list"]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used to determine DV type
export type Props<V extends Variants, _DV extends Defaults<V>, Extra extends Record<string, unknown>> = BaseProps & {
  [K in keyof V]?: keyof V[K]
} & Extra

export type Transform = (css: string) => string

export type Setup<C extends Compose> = {
  compose?: C
  transform?: (css: string) => string
}

export type Defaults<V extends Variants> = {
  [K in keyof V]?: keyof V[K]
}

export type VariantFunction<ExtraProps extends Record<string, unknown> = {}> = <
  const V extends Variants,
  const DV extends Defaults<V>,
  const B extends string,
  const C extends Compose,
>(
  config: Config<V, DV, B, C>,
  modifier?: (data: {
    config: Config<V, DV, B, Compose>
    props: Props<V, DV, ExtraProps>
  }) => Partial<Config<V, DV, B, Compose>>
) => (props: Props<V, DV, ExtraProps>) => string

export type StyleFunctions = {
  cn: Compose
  vn: VariantFunction<{}>
}

export type NotNeverKeys<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends never ? never : K
}[keyof T]

export type HideNever<T extends Record<string, unknown>> = {
  [K in NotNeverKeys<T>]: T[K]
}

export type VariantProps<S extends (props: Props<Variants, Defaults<Variants>, Record<string, unknown>>) => string> =
  Parameters<S>[0] extends Props<infer V, infer DV, Record<string, unknown>>
    ? Omit<
        {
          [K in keyof V]: K extends keyof DV ? never : keyof V[K]
        },
        { [K in keyof DV]: K extends keyof V ? K : never }[keyof DV]
      > & {
        [K in keyof DV]?: K extends keyof V ? keyof V[K] : never
      }
    : never
