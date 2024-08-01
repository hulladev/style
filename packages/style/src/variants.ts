import type { Compose, Config, Defaults, Props, Transform, Variants } from "./types"

export function variants<C extends Compose>(compose: C, transform?: Transform) {
  return <const V extends Variants, const DV extends Defaults<V>, const B extends string>(
      definition: Config<V, DV, B, C>,
      modifier?: (data: { config: Config<V, DV, B, C>; props: Props<V, DV, {}> }) => Partial<Config<V, DV, B, C>>
    ) =>
    (props: Props<V, DV, {}>) => {
      const config = modifier ? { ...definition, ...(modifier({ config: definition, props }) ?? {}) } : definition
      // if variant is passed, use that, if not attempt to use default variant, otherwise just return undefined
      let variantStyle = ""
      for (const key in config.props) {
        const style =
          props[key] !== undefined
            ? config.props[key][props[key] as keyof V[keyof V]]
            : config.defaults?.[key]
              ? config.props[key][config.defaults[key] as keyof V[keyof V]]
              : undefined
        if (style) {
          variantStyle += variantStyle === "" ? style : ` ${style}`
        }
      }
      const customStyles = [props.class, props.className, ...(fromClassList(props["class:list"]) ?? [])]
      // if config.compose is passed, use it instead, otherwise use the default compose method
      const css = (config.compose ?? compose)(config.base, variantStyle, ...customStyles)
      const transformer = transform ?? config.transform
      return transformer ? transformer(css) : css
    }
}

function fromClassList(cl?: string | Record<any, any> | Iterable<any>) {
  switch (typeof cl) {
    case "string":
      return [cl]
    case "object":
      if (cl instanceof Array) {
        return cl
      }
      if (cl instanceof Set || cl instanceof Map) {
        return Array.from(cl)
      }
      return Object.entries(cl).map(([k, v]) => (v ? k : undefined))
    default:
      return undefined
  }
}
