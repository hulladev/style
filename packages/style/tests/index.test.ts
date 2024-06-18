import { describe } from "vitest"
import { style } from "../src"
import { clsx } from "clsx"
import { twJoin, twMerge } from "tailwind-merge"
import { testSuite } from "./testSuite"

describe("vanilla", () => {
  const { cn, vn } = style()
  testSuite("vanilla", cn, vn)
})

describe("clsx", () => {
  const { cn, vn } = style({ compose: clsx })
  testSuite("clsx", cn, vn)
})

describe("twJoin", () => {
  const { cn, vn } = style({ compose: twJoin })
  testSuite("twJoin", cn, vn)
})

describe("twMerge", () => {
  const { cn, vn } = style({ compose: twMerge })
  testSuite("twMerge", cn, vn)
})
