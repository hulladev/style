import { cnBuilder } from "./cnBuilder"
import { vnBuilder } from "./vnBuilder"
import { defaultSerializer } from "./serializer"
import { defaultComposer } from "./composer"
import type { StyleConfig } from "./types.public"

export function style(config?: StyleConfig) {
  const { serializer = defaultSerializer, composer = defaultComposer } = config ?? {}
  const cn = cnBuilder(serializer, composer)
  return {
    cn,
    vn: vnBuilder(cn),
  }
}
