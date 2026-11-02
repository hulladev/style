import { describe, expect, it } from "vitest"
import type { StyleProp, ViewStyle } from "react-native"
import { style } from "@hulla/style"
import { native } from "../src"

const { cn, vn } = style(native)

describe("native composition", () => {
  it("omits empty top-level inputs", () => {
    expect(cn()).toBeUndefined()
    expect(cn(false, null, undefined, "")).toBeUndefined()
  })

  it("returns a single active style by reference", () => {
    const base = Object.freeze({ padding: 12 })
    expect(cn(base)).toBe(base)
    expect(cn(false, base, null)).toBe(base)
  })

  it("retains nested arrays and their conditions without flattening or mutation", () => {
    const base = Object.freeze({ padding: 12 })
    const nested = Object.freeze([base, false, [{ opacity: 0.5 }, null]] satisfies StyleProp<ViewStyle>)
    const override = Object.freeze({ padding: 8 })

    expect(cn(nested)).toBe(nested)
    const result = cn(null, nested, false, override)
    expect(result).toEqual([nested, override])
    expect((result as StyleProp<ViewStyle>[])[0]).toBe(nested)
    expect((result as StyleProp<ViewStyle>[])[1]).toBe(override)
    expect(nested).toEqual([base, false, [{ opacity: 0.5 }, null]])
  })

  it("keeps override order and duplicate references for React Native to resolve", () => {
    const base = { padding: 12 }
    const override = { padding: 8 }
    expect(cn(base, override, base)).toEqual([base, override, base])
  })

  it("can compose an earlier composition as a nested array", () => {
    const base = { padding: 12 }
    const composed = cn(base, { opacity: 0.5 })
    const override = { padding: 8 }
    expect(cn(composed, override)).toEqual([composed, override])
  })
})

describe("native variants", () => {
  it("returns the selected value by reference, including style arrays", () => {
    const compact = Object.freeze({ padding: 8 })
    const roomy = Object.freeze([compact, { padding: 16 }])
    const size = vn({ compact, roomy })
    expect(size("compact")).toBe(compact)
    expect(size("roomy")).toBe(roomy)
    expect(size("roomy")).toBe(size("roomy"))
    expect(cn(size("roomy"))).toBe(roomy)
  })

  it("allows empty variants that cn can omit", () => {
    const state = vn({ idle: undefined, loading: { opacity: 0.5 }, hidden: false })
    expect(state("idle")).toBeUndefined()
    expect(state("hidden")).toBeUndefined()
    expect(cn(state("idle"), state("hidden"))).toBeUndefined()
  })

  it("uses infer only as a type helper", () => {
    expect(vn({ compact: { padding: 8 } }).infer).toBeUndefined()
  })
})
