export function defaultComposer(...strings: string[]): string {
  const seen = new Set<string>()
  const tokens: string[] = []

  for (const value of strings) {
    if (!value) continue
    for (const token of value.split(/\s+/)) {
      if (!token || seen.has(token)) continue
      seen.add(token)
      tokens.push(token)
    }
  }

  return tokens.join(" ")
}
