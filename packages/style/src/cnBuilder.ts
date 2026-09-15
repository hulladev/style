import type { ClassName, Serializer, Composer } from "./types.public"
import { defaultSerializer } from "./serializer"

export function cnBuilder(
  serializer: Serializer,
  composer: Composer
): <const CN extends ClassName[]>(...classes: CN) => string {
  if (serializer === defaultSerializer) {
    return (...classes: ClassName[]): string => {
      // Rest arguments are a fresh array; normalize it without allocating another.
      for (let index = 0; index < classes.length; index++) {
        const value = classes[index]
        if (typeof value !== "string") {
          classes[index] = defaultSerializer(value)
        }
      }
      return composer(...(classes as string[]))
    }
  }

  // Custom serializers may intentionally transform strings too.
  return <const CN extends ClassName[]>(...classes: CN): string => {
    const serialized = classes.map((cls) => serializer(cls))
    return composer(...serialized)
  }
}
