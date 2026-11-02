import type { Serializer, Composer } from "./types.public"
import { defaultSerializer } from "./serializer"

export function cnBuilder<Input, Serialized, Output>(
  serializer: Serializer<Input, Serialized>,
  composer: Composer<Serialized, Output>
): <const Values extends Input[]>(...values: Values) => Output
export function cnBuilder(serializer: Serializer<any, any>, composer: Composer<any, any>) {
  if (serializer === defaultSerializer) {
    return (...classes: any[]) => {
      // Rest arguments are a fresh array; normalize it without allocating another.
      for (let index = 0; index < classes.length; index++) {
        const value = classes[index]
        if (typeof value !== "string") {
          classes[index] = defaultSerializer(value)
        }
      }
      return composer(...classes)
    }
  }

  // Custom serializers may intentionally transform strings too.
  return (...classes: any[]) => {
    const serialized = classes.map((cls) => serializer(cls))
    return composer(...serialized)
  }
}
