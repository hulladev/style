import type { ClassNameNonRecursive } from "./types.private"

export type ClassName = ClassNameNonRecursive | Record<string, ClassNameNonRecursive>

export type Serializer<Input = ClassName, Output = string> = (input: Input) => Output
export type Composer<Input = string, Output = string> = (...values: Input[]) => Output

export type VariantsDefinition<Input = ClassNameNonRecursive | Record<string, any> | any[]> = Record<string, Input>

/** Supply both hooks when changing the pipeline's input, intermediate, or output type. */
export type StylePipeline<Input, Serialized, Output> = {
  serializer: Serializer<Input, Serialized>
  composer: Composer<Serialized, Output>
}

export type StyleHelpers<Input, Output> = {
  cn: <const Values extends Input[]>(...values: Values) => Output
  vn: <const V extends VariantsDefinition<Input>>(variants: V) => Variant<V, Output>
}

/** Preserve a polymorphic composer's call signatures when serialization is identity. */
export type PreservingStyleHelpers<C extends Composer<any, any>> = {
  cn: C
  vn: <const V extends VariantsDefinition<Parameters<C>[number]>>(
    variants: V
  ) => {
    <K extends keyof V>(key: K): V[K] | undefined
    infer: keyof V
  }
}

export type StyleConfig = {
  serializer?: Serializer
  composer?: Composer
}

export type Variant<V extends VariantsDefinition<unknown>, Output = string> = ((prop: keyof V) => Output) & {
  infer: keyof V
}
