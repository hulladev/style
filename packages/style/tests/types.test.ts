import { expectTypeOf } from "vitest"
import { style } from "../src"

const { vn } = style()

const size = vn({
  sm: "a",
  md: "b",
})

expectTypeOf(size.infer).toEqualTypeOf<"sm" | "md">()
expectTypeOf(size).parameters.toEqualTypeOf<["sm" | "md"]>()

type OptionalProps = { size?: typeof size.infer }
type RequiredProps = { size: typeof size.infer }

declare const optionalProps: OptionalProps
declare const requiredProps: RequiredProps

// optional prop is possibly undefined, should not type-check for vn call
// @ts-expect-error
size(optionalProps.size)

size(requiredProps.size)
