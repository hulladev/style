import { expect, test } from "vitest"

import type { vnBuilder } from "../src/vnBuilder"

type SuiteOptions = {
  dedupesExactTokens: boolean
  mergesTailwindConflicts: boolean
}

export const testSuite = (cn: (...args: any[]) => string, vn: ReturnType<typeof vnBuilder>, options: SuiteOptions) => {
  const tone = vn({
    neutral: "text-gray",
    brand: "text-blue",
  })

  test("exports", () => {
    expect(vn).toBeDefined()
    expect(cn).toBeDefined()
  })

  test("cn composes classes", () => {
    expect(cn("hello world")).toStrictEqual("hello world")
    expect(cn("hello", "world")).toStrictEqual("hello world")
  })

  test("cn handles arrays, nested arrays, objects, and vn output", () => {
    const size = vn({ sm: "text-sm", lg: "text-lg" })
    const result = cn("base", ["inline-flex", ["items-center", { rounded: true, hidden: false }]], size("sm"))
    expect(result).toStrictEqual("base inline-flex items-center rounded text-sm")
  })

  test("cn ignores booleans and other falsy-ish values", () => {
    const result = cn("base", false, true, undefined, null, 0, NaN, "")
    expect(result).toStrictEqual("base")
  })

  test("exact duplicate handling matches composer behavior", () => {
    const result = cn("text-sm", ["text-sm", { "text-sm": true }], "text-sm")
    const expected = options.dedupesExactTokens ? "text-sm" : "text-sm text-sm text-sm text-sm"
    expect(result).toStrictEqual(expected)
  })

  test("tailwind conflict handling matches composer behavior", () => {
    const result = cn("px-2", "px-4")
    const expected = options.mergesTailwindConflicts ? "px-4" : "px-2 px-4"
    expect(result).toStrictEqual(expected)
  })

  test("vn resolves explicit values", () => {
    expect(tone("neutral")).toStrictEqual("text-gray")
    expect(tone("brand")).toStrictEqual("text-blue")
  })

  test("array definitions in vn are serialized", () => {
    const spacing = vn({
      compact: ["p-1", "gap-1"],
      comfy: ["p-4", "gap-3"],
    })

    expect(spacing("compact")).toStrictEqual("p-1 gap-1")
    expect(spacing("comfy")).toStrictEqual("p-4 gap-3")
  })

  test("object definitions in vn are serialized", () => {
    const state = vn({
      enabled: { "opacity-100": true, hidden: false },
      disabled: { "opacity-60": true, "pointer-events-none": true },
    })

    expect(state("enabled")).toStrictEqual("opacity-100")
    expect(state("disabled")).toStrictEqual("opacity-60 pointer-events-none")
  })

  test("nested arrays and objects in vn are serialized", () => {
    const mode = vn({
      one: ["base-class", { active: true, disabled: false }],
      two: [{ primary: true }, "secondary-class"],
    })

    expect(mode("one")).toStrictEqual("base-class active")
    expect(mode("two")).toStrictEqual("primary secondary-class")
  })

  test("vn object syntax respects truthiness", () => {
    const flags = vn({
      on: { enabled: true, disabled: false, active: 1, hidden: 0, highlighted: "yes", muted: "" },
    })

    expect(flags("on")).toStrictEqual("enabled active highlighted")
  })

  test("cn composes multiple vns and raw strings", () => {
    const color = vn({ blue: "text-blue", red: "text-red" })
    const size = vn({ sm: "text-sm", lg: "text-lg" })
    const spacing = vn({ compact: "p-1", comfortable: "p-4" })

    const result1 = cn(color("blue"), size("sm"), spacing("compact"), "extra-class")
    expect(result1).toStrictEqual("text-blue text-sm p-1 extra-class")

    const result2 = cn("base-class", color("red"), size("lg"), spacing("comfortable"), "another-class")
    expect(result2).toStrictEqual("base-class text-red text-lg p-4 another-class")
  })
}