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
// @ts-expect-error optional variant props must have a default before selection
size(optionalProps.size)

size(requiredProps.size)

const adapted = style({ serializer: (value: number) => value, composer: (...values: number[]) => ({ values }) })
expectTypeOf(adapted.cn(1, 2)).toEqualTypeOf<{ values: number[] }>()
const amount = adapted.vn({ small: 2, large: 5 })
expectTypeOf(amount.infer).toEqualTypeOf<"small" | "large">()
expectTypeOf(amount("small")).toEqualTypeOf<{ values: number[] }>()

// @ts-expect-error this serializer accepts numbers
adapted.cn("base")
// @ts-expect-error variant values must match the serializer input
adapted.vn({ small: "two" })
// @ts-expect-error variant keys remain checked
amount("medium")
// @ts-expect-error the default serializer emits strings, so a numeric composer needs a serializer
style({ composer: (...values: number[]) => values })
// @ts-expect-error the default composer accepts strings, so a numeric serializer needs a composer
style({ serializer: (value: number) => value })
// @ts-expect-error the serializer output must match the composer input
style({ serializer: (value: number) => value, composer: (...values: string[]) => values })
// @ts-expect-error the unreleased adapter property has been removed
style({ adapter: { compose: (...values: number[]) => values } })

const transformed = style({
  serializer: (value: number) => ({ value }),
  composer: (...values: { value: number }[]) => values.map((entry) => entry.value),
})
expectTypeOf(transformed.cn(1, 2)).toEqualTypeOf<number[]>()
expectTypeOf(transformed.vn({ small: 2 })("small")).toEqualTypeOf<number[]>()

const defaultHelpers = style()
const classHelpers = style({ composer: (...values) => values.join(" ") })
expectTypeOf(defaultHelpers.cn("base")).toEqualTypeOf<string>()
expectTypeOf(classHelpers.cn("base")).toEqualTypeOf<string>()

// Preserve the existing broader variant-map input contract for class helpers.
const nestedClasses = vn({
  conditional: { active: { nested: true } },
  mixed: ["base", { active: true }],
})
expectTypeOf(nestedClasses("mixed")).toEqualTypeOf<string>()

declare function preservingComposer<const Value>(value: Value): Value | undefined
declare function preservingComposer<const Values extends unknown[]>(
  ...values: Values
): Values[number] | Values[number][] | undefined
const preserving = style({ serializer: <Value>(value: Value) => value, composer: preservingComposer })
expectTypeOf(preserving.cn({ padding: 8 })).toEqualTypeOf<{ readonly padding: 8 } | undefined>()
const recipe = preserving.vn({ box: { padding: 8 }, label: { fontWeight: "600" } })
expectTypeOf(recipe("label")).toEqualTypeOf<{ readonly fontWeight: "600" } | undefined>()
// @ts-expect-error preserving variants still check their keys
recipe("unknown")
