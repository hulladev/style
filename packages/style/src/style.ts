import { cnBuilder } from "./cnBuilder"
import { vnBuilder } from "./vnBuilder"
import { defaultSerializer } from "./serializer"
import { defaultComposer } from "./composer"
import type {
  ClassName,
  Composer,
  PreservingStyleHelpers,
  StyleConfig,
  StyleHelpers,
  StylePipeline,
  Variant,
  VariantsDefinition,
} from "./types.public"

export function style(config?: StyleConfig): {
  cn: StyleHelpers<ClassName, string>["cn"]
  vn: <const V extends VariantsDefinition>(variants: V) => Variant<V>
}
// Identity serialization preserves overloaded/generic composer signatures. The single-value
// contract also lets vn retain each selected value's type instead of a broad output union.
export function style<C extends Composer<any, any>>(config: {
  serializer: <Value>(value: Value) => Value
  composer: C & (<Value extends Parameters<C>[number]>(value: Value) => Value | undefined)
}): PreservingStyleHelpers<C>
export function style<Input, Serialized, Output>(
  config: StylePipeline<Input, Serialized, Output>
): StyleHelpers<Input, Output>
// Erase the correlated hook types internally; the overloads enforce their compatibility.
export function style(config?: StyleConfig | StylePipeline<any, any, any>) {
  const { serializer = defaultSerializer, composer = defaultComposer } = config ?? {}
  const cn = cnBuilder<any, any, any>(serializer, composer)
  return {
    cn,
    vn: vnBuilder<any, any>(cn),
  }
}
