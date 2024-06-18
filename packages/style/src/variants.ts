import type { Compose, Config, Props, Transform, Variants } from "./types"

export function variants<C extends Compose>(compose: C, transform?: Transform) {
  return <const V extends Variants, const DV extends keyof V, const B extends string>(config: Config<V, DV, B, C>) =>
    (props: Props<V>) => {
      // if variant is passed, use that, if not attempt to use default variant, otherwise just return undefined
      const variantStyle = props.variant
        ? config.variants?.[props.variant]
        : config.defaultVariant
          ? config.variants?.[config.defaultVariant]
          : undefined
      const customStyles = [props.class, props.className, ...(props["class:list"] ?? [])]
      // if config.compose is passed, use it instead, otherwise use the default compose method
      const css = (config.compose ?? compose)(config.base, variantStyle, ...customStyles)
      const transformer = transform ?? config.transform
      return transformer ? transformer(css) : css
    }
}
