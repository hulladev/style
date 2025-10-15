import { expect, test } from "vitest"
import type { variantBuilder } from "../src/variantBuilder"
import type { variantGroupBuilder } from "../src/variantGroupBuilder"

// this test suite is re-run multiple times based on the passed cn, to make it DRY
export const testSuite = (
  cn: (...args: any[]) => string,
  variant: ReturnType<typeof variantBuilder>,
  variantGroup: typeof variantGroupBuilder
) => {
  const myVariant = variant({
    name: "variant",
    classes: {
      default: "hello",
      world: "world",
    },
    default: "default",
  })

  test("exports", () => {
    expect(variant).toBeDefined()
    expect(cn).toBeDefined()
  })

  test("cn", () => {
    expect(cn("hello world")).toStrictEqual("hello world")
    expect(cn("hello", "world")).toStrictEqual("hello world")
  })

  test("variants defined", () => {
    expect(myVariant.css("default")).toStrictEqual("hello")
    expect(myVariant.css("world")).toStrictEqual("world")
  })

  test("default variant works", () => {
    expect(myVariant.css()).toStrictEqual("hello")
  })

  test("base styles work", () => {
    const baseVariant = variant({
      name: "variant",
      classes: {
        world: "world",
        me: "me",
      },
      default: "world",
      base: "base",
    })
    expect(baseVariant.css("world")).toStrictEqual("base world")
    expect(baseVariant.css("me")).toStrictEqual("base me")
    expect(baseVariant.css()).toStrictEqual("base world")
  })

  test("without specifying default variants", () => {
    const noDefaultVariant = variant({
      name: "variant",
      classes: {
        world: "world",
        me: "me",
      },
      base: "base",
    })
    expect(noDefaultVariant.css("world")).toStrictEqual("base world")
    expect(noDefaultVariant.css("me")).toStrictEqual("base me")
  })

  test("array definitions in classes", () => {
    const arrayVariant = variant({
      name: "size",
      classes: {
        sm: ["text-sm", "p-2"],
        md: ["text-md", "p-4"],
      },
      default: "sm",
      base: "base",
    })
    expect(arrayVariant.css("sm")).toStrictEqual("base text-sm p-2")
    expect(arrayVariant.css("md")).toStrictEqual("base text-md p-4")
    expect(arrayVariant.css()).toStrictEqual("base text-sm p-2")
  })

  test("object definitions in classes", () => {
    const objectVariant = variant({
      name: "variant",
      classes: {
        primary: { "text-blue": true, "bg-white": true, hidden: false },
        secondary: { "text-red": true, "bg-black": false },
      },
      default: "primary",
    })
    // All composers now handle objects consistently through serialization
    expect(objectVariant.css("primary")).toStrictEqual("text-blue bg-white")
    expect(objectVariant.css("secondary")).toStrictEqual("text-red")
  })

  test("nested arrays and objects", () => {
    const nestedVariant = variant({
      name: "complex",
      classes: {
        one: ["base-class", { active: true, disabled: false }],
        two: [{ primary: true }, "secondary-class"],
      },
      default: "one",
    })
    // All composers now handle nested arrays with objects consistently through serialization
    expect(nestedVariant.css("one")).toStrictEqual("base-class active")
    expect(nestedVariant.css("two")).toStrictEqual("primary secondary-class")
  })

  test("variantGroup basic functionality", () => {
    const sizeVariant = variant({
      name: "size",
      classes: {
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
      },
      default: "md",
    })

    const colorVariant = variant({
      name: "color",
      classes: {
        primary: "text-blue",
        secondary: "text-red",
      },
      default: "primary",
    })

    const group = variantGroup(sizeVariant, colorVariant)

    expect(group.css({ size: "sm", color: "primary" })).toStrictEqual("text-sm text-blue")
    expect(group.css({ size: "lg", color: "secondary" })).toStrictEqual("text-lg text-red")
    expect(group.css({ size: "md", color: "primary" })).toStrictEqual("text-md text-blue")
  })

  test("variantGroup with defaults", () => {
    const sizeVariant = variant({
      name: "size",
      classes: {
        sm: "text-sm",
        md: "text-md",
      },
      default: "md",
    })

    const colorVariant = variant({
      name: "color",
      classes: {
        primary: "text-blue",
        secondary: "text-red",
      },
      default: "primary",
    })

    const group = variantGroup(sizeVariant, colorVariant)

    // Should use defaults when not specified
    expect(group.css({})).toStrictEqual("text-md text-blue")
    expect(group.css({ size: "sm" })).toStrictEqual("text-sm text-blue")
    expect(group.css({ color: "secondary" })).toStrictEqual("text-md text-red")
  })

  test("variantGroup with base styles", () => {
    const sizeVariant = variant({
      name: "size",
      classes: {
        sm: "p-2",
        lg: "p-4",
      },
      default: "sm",
      base: "rounded",
    })

    const colorVariant = variant({
      name: "color",
      classes: {
        blue: "bg-blue",
        red: "bg-red",
      },
      default: "blue",
      base: "border",
    })

    const group = variantGroup(sizeVariant, colorVariant)

    expect(group.css({ size: "sm", color: "blue" })).toStrictEqual("rounded p-2 border bg-blue")
    expect(group.css({ size: "lg", color: "red" })).toStrictEqual("rounded p-4 border bg-red")
  })

  test("variantGroup with array definitions", () => {
    const sizeVariant = variant({
      name: "size",
      classes: {
        sm: ["text-sm", "p-2"],
        lg: ["text-lg", "p-4"],
      },
      default: "sm",
    })

    const colorVariant = variant({
      name: "color",
      classes: {
        primary: ["text-blue", "bg-blue-50"],
        secondary: ["text-red", "bg-red-50"],
      },
      default: "primary",
    })

    const group = variantGroup(sizeVariant, colorVariant)

    expect(group.css({ size: "sm", color: "primary" })).toStrictEqual("text-sm p-2 text-blue bg-blue-50")
    expect(group.css({ size: "lg", color: "secondary" })).toStrictEqual("text-lg p-4 text-red bg-red-50")
  })

  test("variantGroup with object definitions", () => {
    const sizeVariant = variant({
      name: "size",
      classes: {
        sm: { "text-sm": true, "p-2": true },
        lg: { "text-lg": true, "p-4": true, hidden: false },
      },
      default: "sm",
    })

    const colorVariant = variant({
      name: "color",
      classes: {
        primary: { "text-blue": true, "bg-white": true },
        secondary: { "text-red": true, "bg-black": false },
      },
      default: "primary",
    })

    const group = variantGroup(sizeVariant, colorVariant)

    // All composers now handle objects consistently through serialization
    expect(group.css({ size: "sm", color: "primary" })).toStrictEqual("text-sm p-2 text-blue bg-white")
    expect(group.css({ size: "lg", color: "secondary" })).toStrictEqual("text-lg p-4 text-red")
  })

  test("variantGroup with nested arrays and objects", () => {
    const sizeVariant = variant({
      name: "size",
      classes: {
        sm: ["text-sm", { "p-2": true, "m-0": false }],
        lg: [{ "text-lg": true }, "p-4"],
      },
      default: "sm",
    })

    const stateVariant = variant({
      name: "state",
      classes: {
        active: ["active", { enabled: true, disabled: false }],
        inactive: [{ inactive: true }, "disabled"],
      },
      default: "active",
    })

    const group = variantGroup(sizeVariant, stateVariant)

    // All composers now handle nested arrays with objects consistently through serialization
    expect(group.css({ size: "sm", state: "active" })).toStrictEqual("text-sm p-2 active enabled")
    expect(group.css({ size: "lg", state: "inactive" })).toStrictEqual("text-lg p-4 inactive disabled")
  })

  test("cn composing variant.css, variantGroup.css, and string literals", () => {
    const colorVariant = variant({
      name: "color",
      classes: {
        blue: "text-blue",
        red: "text-red",
      },
      default: "blue",
    })

    const sizeVariant = variant({
      name: "size",
      classes: {
        sm: "text-sm",
        lg: "text-lg",
      },
      default: "sm",
    })

    const spacingVariant = variant({
      name: "spacing",
      classes: {
        compact: "p-1",
        comfortable: "p-4",
      },
      default: "compact",
    })

    const group = variantGroup(sizeVariant, spacingVariant)

    // Compose variant.css, group.css, and string literals together
    const result1 = cn(colorVariant.css("blue"), group.css({ size: "sm", spacing: "compact" }), "extra-class")
    expect(result1).toStrictEqual("text-blue text-sm p-1 extra-class")

    const result2 = cn(
      "base-class",
      colorVariant.css("red"),
      group.css({ size: "lg", spacing: "comfortable" }),
      "another-class"
    )
    expect(result2).toStrictEqual("base-class text-red text-lg p-4 another-class")

    // With default values
    const result3 = cn(colorVariant.css(), group.css({}), "default-combo")
    expect(result3).toStrictEqual("text-blue text-sm p-1 default-combo")
  })
}
