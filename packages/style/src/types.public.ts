import type { APIPropsMapper, ClassesDefinition, ClassNameNonRecursive, GroupProps } from "./types.private"

export type ClassName = ClassNameNonRecursive | Record<string, ClassNameNonRecursive>

export type Serializer = (input: ClassName) => string
export type Composer = (...strings: string[]) => string

// Unique symbol to represent "no default" - users are extremely unlikely to use this
export declare const NO_DEFAULT: unique symbol
export type NO_DEFAULT = typeof NO_DEFAULT

export type Variant<
  N extends string,
  V extends ClassesDefinition,
  D extends keyof V | NO_DEFAULT = NO_DEFAULT,
  B extends string = "",
> = {
  name: N
  classes: V
  base?: B
  default?: D extends NO_DEFAULT ? never : D
}

export type StyleConfig = {
  serializer?: Serializer
  composer?: Composer
}

export type VariantAPI<V extends Variant<any, any, any, any>> = {
  params: V
  css: V extends Variant<any, any, NO_DEFAULT, any>
    ? (prop: keyof V["classes"]) => string
    : (prop?: keyof V["classes"]) => string
}

export type VariantGroupAPI<V extends readonly VariantAPI<any>[]> = {
  params: Record<V[number]["params"]["name"], VariantAPI<any>>
  css: (props: GroupProps<V>) => string
}

export type StyleFunctions = {
  cn: <const CN extends ClassName[]>(...classes: CN) => string
}

export type VariantProps<V extends VariantAPI<any> | VariantGroupAPI<any>> =
  V extends VariantGroupAPI<infer G>
    ? GroupProps<G>
    : V extends VariantAPI<infer V>
      ? APIPropsMapper<VariantAPI<V>>
      : {}
