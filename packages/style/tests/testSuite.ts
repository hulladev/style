import { expect, test } from "vitest"
import type { Compose, VariantFunction } from "../src/types"

type Suites = "vanilla" | "clsx" | "twJoin" | "twMerge"

// this test suite is re-run multiple times based on the passed cn, to make it DRY
export const testSuite = <CN extends Compose, VN extends VariantFunction>(suite: Suites, cn: CN, vn: VN) => {
  const variant = vn({
    props: {
      variant: {
        default: "hello",
        world: "world",
      },
    },
    defaults: {
      variant: "default",
    },
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
      props: {
        variant: {
          world: "world",
          me: "me",
        },
      },
      defaults: {
        variant: "world",
      },
      base: "base",
    })
    expect(baseVariant({ variant: "world" })).toStrictEqual("base world")
    expect(baseVariant({ variant: "me" })).toStrictEqual("base me")
    expect(baseVariant({})).toStrictEqual("base world")
  })
  test("without specifying default variants", () => {
    const variant = vn({
      base: "base",
      props: {
        variant: {
          world: "world",
          me: "me",
        },
      },
    })
    expect(variant({ variant: "world" })).toStrictEqual("base world")
    expect(variant({ variant: "me" })).toStrictEqual("base me")
    expect(variant({})).toStrictEqual("base")
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
    // only my default compose implementation and tailwing-merge work
    if (suite === "twMerge" || suite === "vanilla") {
      expect(value).toStrictEqual("hello mx-0")
    } else {
      expect(value).toStrictEqual("hello mx-0 mx-0")
    }
  })
  test("multiple props", () => {
    const value = vn({
      base: "base",
      props: {
        variant: {
          world: "world",
          me: "me",
        },
        size: {
          sm: "sm",
          md: "md",
        },
      },
      defaults: {
        variant: "world",
        size: "sm",
      },
    })
    expect(value({})).toStrictEqual("base world sm")
    expect(value({ variant: "me" })).toStrictEqual("base me sm")
    expect(value({ size: "md" })).toStrictEqual("base world md")
    expect(value({ size: "md", variant: "me" })).toStrictEqual("base me md")
    expect(value({ size: "md", variant: "world" })).toStrictEqual("base world md")
  })
  test("running with modifier", () => {
    const withMod = vn(
      {
        props: {
          variant: {
            world: "world",
            me: "me",
          },
        },
      },
      ({ props }) => (props.variant === "world" ? { base: "base" } : {})
    )
    expect(withMod({ variant: "world" })).toStrictEqual("base world")
    expect(withMod({ variant: "me" })).toStrictEqual("me")
  })
  test("props modifier", () => {
    const vnOverride = vn as unknown as VariantFunction<{ foo: boolean }>
    const vnp = vnOverride(
      {
        props: {
          variant: {
            world: "world",
            me: "me",
          },
        },
      },
      ({ props }) => {
        if (props.foo) {
          return { base: "base" }
        }
        return {}
      }
    )
    expect(vnp({ variant: "world", foo: true })).toStrictEqual("base world")
    expect(vnp({ variant: "world", foo: false })).toStrictEqual("world")
  })
}
