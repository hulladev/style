import type { Variant, VariantAPI, NO_DEFAULT } from "./types.public"
import type { ClassesDefinition } from "./types.private"

export function variantBuilder(composer: <const CN extends any[]>(...classes: CN) => string) {
  // Overload for variants with default specified (must come first for proper matching)
  function variantDefinitionOverload<
    N extends string,
    V extends ClassesDefinition,
    D extends keyof V & string,
    B extends string = "",
  >(variantDefinition: { name: N; classes: V; default: D; base?: B }): VariantAPI<Variant<N, V, D, B>>

  // Overload for variants without default (explicitly exclude default property)
  function variantDefinitionOverload<N extends string, V extends ClassesDefinition, B extends string = "">(
    variantDefinition: { name: N; classes: V; base?: B } & { default?: undefined }
  ): VariantAPI<Variant<N, V, NO_DEFAULT, B>>

  // Implementation
  function variantDefinitionOverload<V extends Variant<any, any, any, any>>(variantDefinition: V): any {
    return {
      params: variantDefinition,
      css: (prop?: keyof V["classes"]) => {
        if (variantDefinition.default === undefined && prop === undefined) {
          throw new Error(
            `Missing prop key for css function in variant ${variantDefinition.name}. Either provide a default or pass a prop please.`
          )
        }
        const baseClasses = variantDefinition.base ? [variantDefinition.base] : []
        const variantClasses = variantDefinition.classes[prop ?? variantDefinition.default]
        return composer(...baseClasses, variantClasses)
      },
    }
  }

  return variantDefinitionOverload
}
