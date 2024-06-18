import type { ClassName } from "./types"

export function defaultCompose(...classes: ClassName[]) {
  const css: string[] = []
  for (const style of classes.filter(Boolean)) {
    for (const items of (style as string).split(" ")) {
      css.push(items)
    }
  }
  return Array.from(new Set(css).values()).join(" ")
}
