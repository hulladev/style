import type { ClassNameNonRecursive } from "./types.private"

export type ClassName = ClassNameNonRecursive | Record<string, ClassNameNonRecursive>

export type Serializer = (input: ClassName) => string
export type Composer = (...strings: string[]) => string

export type VariantsDefinition = Record<string, ClassNameNonRecursive | Record<string, any> | any[]>

export type StyleConfig = {
  serializer?: Serializer
  composer?: Composer
}

export type Variant<V extends VariantsDefinition> = ((prop: keyof V) => string) & {
  infer: keyof V
}
