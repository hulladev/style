import { describe, expect, test, vi } from "vitest"
import { defaultSerializer, style } from "../src"
import { clsx } from "clsx"
import { twJoin, twMerge } from "tailwind-merge"
import { testSuite } from "./testSuite"

describe("vanilla", () => {
  const { cn, vn } = style()
  testSuite(cn, vn, {
    dedupesExactTokens: true,
    mergesTailwindConflicts: false,
  })
})

describe("clsx", () => {
  const { cn, vn } = style({ composer: clsx })
  testSuite(cn, vn, {
    dedupesExactTokens: false,
    mergesTailwindConflicts: false,
  })
})

describe("twJoin", () => {
  const { cn, vn } = style({ composer: twJoin })
  testSuite(cn, vn, {
    dedupesExactTokens: false,
    mergesTailwindConflicts: false,
  })
})

describe("twMerge", () => {
  const { cn, vn } = style({ composer: twMerge })
  testSuite(cn, vn, {
    dedupesExactTokens: true,
    mergesTailwindConflicts: true,
  })
})

describe("serialization", () => {
  test("passes strings unchanged to a custom composer, including empty strings", () => {
    const composer = vi.fn((...values: string[]) => values.join("|"))
    const { cn } = style({ composer })

    expect(cn("  base  ", "", "px-2 px-4")).toBe("  base  ||px-2 px-4")
    expect(composer).toHaveBeenLastCalledWith("  base  ", "", "px-2 px-4")
    expect(cn()).toBe("")
    expect(composer).toHaveBeenLastCalledWith()
  })

  test("normalizes mixed inputs without changing argument positions or caller arrays", () => {
    const composer = vi.fn((...values: string[]) => values.join("|"))
    const { cn } = style({ composer })
    const classes = ["px-2", "py-1"]
    const flags = { active: true, hidden: false }

    expect(cn("base", classes, flags, undefined, false, true, 0, null)).toBe("base|px-2 py-1|active|||||")
    expect(composer).toHaveBeenLastCalledWith("base", "px-2 py-1", "active", "", "", "", "", "")
    expect(classes).toEqual(["px-2", "py-1"])
    expect(flags).toEqual({ active: true, hidden: false })
  })

  test("uses the same normalization when the default serializer is passed explicitly", () => {
    const { cn, vn } = style({ serializer: defaultSerializer, composer: twMerge })
    const spacing = vn({ compact: { "px-2": true }, roomy: ["px-4", "py-2"] })

    expect(cn(spacing("compact"), spacing("roomy"), "px-6")).toBe("py-2 px-6")
  })

  test("custom serializers still receive every input in cn and vn", () => {
    const serializer = vi.fn((value) => `[${defaultSerializer(value)}]`)
    const { cn, vn } = style({ serializer, composer: (...values) => values.join("|") })
    const flags = { active: true }

    expect(cn("base", flags, undefined)).toBe("[base]|[active]|[]")
    expect(serializer.mock.calls).toEqual([["base"], [flags], [undefined]])

    serializer.mockClear()
    const tone = vn({ primary: "text-blue" })
    expect(tone("primary")).toBe("[text-blue]")
    expect(serializer.mock.calls).toEqual([["text-blue"]])
  })
})
