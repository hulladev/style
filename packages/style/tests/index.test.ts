import { describe } from "vitest"
import { style } from "../src"
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
