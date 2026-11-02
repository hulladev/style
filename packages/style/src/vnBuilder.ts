import type { Variant, VariantsDefinition } from "./types.public"

export function vnBuilder<Input, Output>(composer: (...values: Input[]) => Output) {
  return function vnCreator<const V extends VariantsDefinition<Input>>(variants: V): Variant<V, Output> {
    const fn = ((prop: keyof V) => composer(variants[prop])) as Variant<V, Output>
    fn.infer = undefined as never
    return fn
  }
}
