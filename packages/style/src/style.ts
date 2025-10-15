import { cnBuilder } from "./cnBuilder"
import { variantGroupBuilder } from "./variantGroupBuilder"
import { defaultSerializer } from "./serializer"
import { defaultComposer } from "./composer"
import type { StyleConfig } from "./types.public"
import { variantBuilder } from "./variantBuilder"

export function style(config?: StyleConfig) {
  const { serializer = defaultSerializer, composer = defaultComposer } = config ?? {}
  const cn = cnBuilder(serializer, composer)
  return {
    cn,
    variantGroup: variantGroupBuilder,
    variant: variantBuilder(cn),
  }
}
