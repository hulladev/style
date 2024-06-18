import { expect, test } from "vitest"
import type { style } from "../src"
import type { Compose } from "../src/types"

type Suites = "vanilla" | "clsx" | "twJoin" | "twMerge"

// this test suite is re-run multiple times based on the passed cn, to make it DRY
export const testSuite = <CN extends Compose, VN extends ReturnType<typeof style<CN>>["vn"]>(
  suite: Suites,
  cn: CN,
  vn: VN
) => {
  const variant = vn({
    variants: {
      default: "hello",
      world: "world",
    },
    defaultVariant: "default",
  })
  test("exports", () => {
    expect(vn).toBeDefined()
    expect(cn).toBeDefined()
  })
  test("cn", () => {
    expect(cn("hello world")).toStrictEqual("hello world")
    expect(cn("hello", "world")).toStrictEqual("hello world")
  })
  test("variants defined", () => {
    expect(variant({ variant: "default" })).toStrictEqual("hello")
    expect(variant({ variant: "world" })).toStrictEqual("world")
  })
  test("default variant works", () => {
    expect(variant({})).toStrictEqual("hello")
  })
  test("base styles work", () => {
    const baseVariant = vn({
      variants: {
        world: "world",
      },
      defaultVariant: "world",
      base: "base",
    })
    expect(baseVariant({ variant: "world" })).toStrictEqual("base world")
    expect(baseVariant({})).toStrictEqual("base world")
  })
  test("extra custom props", () => {
    const value = variant({ class: "class", className: "className", "class:list": ["class", "list"] })
    if (suite === "vanilla") {
      expect(value).toStrictEqual("hello class className list")
    } else {
      expect(value).toStrictEqual("hello class className class list")
    }
  })
  test("duplicate prop", () => {
    const value = variant({ class: "mx-0 mx-0" })
    if (suite === "twMerge" || suite === "vanilla") {
      expect(value).toStrictEqual("hello mx-0")
    } else {
      expect(value).toStrictEqual("hello mx-0 mx-0")
    }
  })
}
