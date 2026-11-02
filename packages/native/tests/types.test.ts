import { expectTypeOf } from "vitest"
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native"
import { style } from "@hulla/style"
import { native } from "../src"

const { cn, vn } = style(native)
const size = vn({ compact: { padding: 8 }, regular: [{ padding: 12 }, false] })
expectTypeOf(size.infer).toEqualTypeOf<"compact" | "regular">()
expectTypeOf(size("compact")).toEqualTypeOf<{ readonly padding: 8 } | undefined>()
expectTypeOf(cn(size("regular"), { padding: 16 })).toMatchTypeOf<StyleProp<ViewStyle>>()

// @ts-expect-error unknown variant
size("large")
declare const optionalSize: typeof size.infer | undefined
// @ts-expect-error callers choose an explicit default for optional variants
size(optionalSize)
// @ts-expect-error CSS strings are not native styles
cn("p-4")
// @ts-expect-error native style values retain their native types
cn({ opacity: "dim" })
// @ts-expect-error a CSS class condition map is not a native style object
cn({ "p-4": true })
expectTypeOf(cn({ fontWeight: "600" })).toMatchTypeOf<StyleProp<TextStyle>>()
// @ts-expect-error a native variant cannot contain a CSS string
vn({ compact: "p-4" })
// @ts-expect-error invalid native property value in a variant
vn({ compact: { opacity: "dim" } })
// @ts-expect-error native is a shared configuration object, not a factory
native()

const weight = vn({ regular: { fontWeight: "400" }, strong: { fontWeight: "600" } })
expectTypeOf(cn(weight("strong"), { fontSize: 14 })).toMatchTypeOf<StyleProp<TextStyle>>()
cn({ fontVariant: ["tabular-nums"] })
// @ts-expect-error invalid font weight
vn({ invalid: { fontWeight: "strong" } })

expectTypeOf(cn({ resizeMode: "cover" })).toMatchTypeOf<StyleProp<ImageStyle>>()
// @ts-expect-error invalid resize mode
cn({ resizeMode: "huge" })

declare const existing: StyleProp<ViewStyle>
cn(existing, [false, { opacity: 0.5 }, [null, { padding: 8 }]])
cn(undefined, false, null, "")

// One shared instance retains types at the component that consumes each recipe.
const mixed = vn({
  view: { overflow: "scroll" },
  text: { fontWeight: "600" },
  image: { resizeMode: "cover" },
})
expectTypeOf(mixed("view")).toMatchTypeOf<StyleProp<ViewStyle>>()
expectTypeOf(mixed("text")).toMatchTypeOf<StyleProp<TextStyle>>()
expectTypeOf(mixed("image")).toMatchTypeOf<StyleProp<ImageStyle>>()
// @ts-expect-error image styles cannot consume this text-specific recipe
const invalidImage: StyleProp<ImageStyle> = mixed("text")
void invalidImage

// Copy-ready declaration checks documented for one shared helper pair.
const containerStyle = cn({ padding: 16 } satisfies ViewStyle)
const titleStyle = cn({ fontSize: 20, fontWeight: "600" } satisfies TextStyle)
const photoStyle = cn({ resizeMode: "cover" } satisfies ImageStyle)
expectTypeOf(containerStyle).toMatchTypeOf<StyleProp<ViewStyle>>()
expectTypeOf(titleStyle).toMatchTypeOf<StyleProp<TextStyle>>()
expectTypeOf(photoStyle).toMatchTypeOf<StyleProp<ImageStyle>>()
const checkedWeight = vn({
  regular: { fontWeight: "400" },
  strong: { fontWeight: "600" },
} satisfies Record<string, TextStyle>)
expectTypeOf(checkedWeight.infer).toEqualTypeOf<"regular" | "strong">()
expectTypeOf(checkedWeight("strong")).toMatchTypeOf<StyleProp<TextStyle>>()
// @ts-expect-error satisfies validates the native property value at declaration
cn({ fontWeight: "strong" } satisfies TextStyle)
