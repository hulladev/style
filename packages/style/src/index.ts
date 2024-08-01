import { defaultCompose } from "./defaultCompose"
import type { ClassName, Compose, Setup, StyleFunctions } from "./types"
import { variants } from "./variants"

export function style<C extends Compose>(setup?: Setup<C>): StyleFunctions {
  const { compose = defaultCompose, transform } = setup ?? {}
  return {
    vn: variants(compose, transform),
    cn: transform ? (...classes: ClassName[]) => transform(compose(...classes)) : compose,
  }
}

export * from "./types"
