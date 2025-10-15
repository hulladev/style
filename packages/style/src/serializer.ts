import { entries } from "./objects"
import type { ClassName } from "./types.public"

function toValue(style: ClassName): string | number | null {
  if (typeof style === "string" || typeof style === "number") {
    return style
  }
  if (typeof style === "object") {
    if (Array.isArray(style)) {
      return style.map(toValue).join(" ")
    }
    if (style instanceof Set || style instanceof Map) {
      return Array.from(style).map(toValue).join(" ")
    }
    let result = ""
    entries(style ?? {}).forEach(([key, val]) => {
      if (val) {
        result += (result ? " " : "") + key
      }
    })
    return result
  }

  return null
}

export function defaultSerializer(input: ClassName): string {
  const value = toValue(input)
  return value ? String(value) : ""
}

