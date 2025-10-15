import { describe } from "vitest"
import { style } from "../src"
import { clsx } from "clsx"
import { twJoin, twMerge } from "tailwind-merge"
import { testSuite } from "./testSuite"

describe("vanilla", () => {
  const { cn, variant, variantGroup } = style()
  testSuite(cn, variant, variantGroup)
})

describe("clsx", () => {
  const { cn, variant, variantGroup } = style({ composer: clsx })
  testSuite(cn, variant, variantGroup)
})

describe("twJoin", () => {
  const { cn, variant, variantGroup } = style({ composer: twJoin })
  testSuite(cn, variant, variantGroup)
})

describe("twMerge", () => {
  const { cn, variant, variantGroup } = style({ composer: twMerge })
  testSuite(cn, variant, variantGroup)
})
