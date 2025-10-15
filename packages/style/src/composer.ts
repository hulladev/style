export function defaultComposer(...strings: string[]): string {
  return strings.filter(Boolean).join(" ")
}

