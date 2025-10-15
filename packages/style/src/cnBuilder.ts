import type { ClassName, Serializer, Composer } from "./types.public"

export function cnBuilder(
  serializer: Serializer,
  composer: Composer
): <const CN extends ClassName[]>(...classes: CN) => string {
  return <const CN extends ClassName[]>(...classes: CN): string => {
    const serialized = classes.map((cls) => serializer(cls))
    return composer(...serialized)
  }
}
