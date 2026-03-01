import type { Variant, VariantsDefinition } from "./types.public"

export function vnBuilder(composer: <const CN extends any[]>(...classes: CN) => string) {
  return function vnCreator<const V extends VariantsDefinition>(variants: V): Variant<V> {
    const fn = ((prop: keyof V) => composer(variants[prop])) as Variant<V>
    fn.infer = undefined as never
    return fn
  }
}
