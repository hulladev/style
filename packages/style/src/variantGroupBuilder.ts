import type { GroupProps } from "./types.private"
import type { VariantAPI, VariantGroupAPI } from "./types.public"

export function variantGroupBuilder<const V extends readonly VariantAPI<any>[]>(...variants: V): VariantGroupAPI<V> {
  return {
    params: variants.reduce(
      (acc, v) => {
        acc[v.params.name] = v.params
        return acc
      },
      {} as Record<string, VariantAPI<any>>
    ),
    css: (props: GroupProps<V>) =>
      variants.map((v) => v.css(props[v.params.name as keyof typeof props] as any)).join(" "),
  }
}
