# @hulla/style-native

Extend the existing `style()` factory from `@hulla/style` to compose React Native
style objects and define typed variants. This optional plugin exports the `native` preset;
the core owns `cn`, `vn`, and variant inference. The preset contains an identity
`serializer` and a native `composer` for the existing configuration hooks. It has no
runtime imports; React Native supplies its style types.

Requires `@hulla/style` 0.5.0 or later, before 0.6, and React Native 0.81 or later,
before 1.0. Typed usage requires TypeScript 5.4 or later.

Install both packages in the native app:

```sh
pnpm add @hulla/style @hulla/style-native
```

The core does not depend on the native plugin, so web consumers install only
`@hulla/style`. Configure the preset once in the app's shared native style module.

## Compose a native style

Create one shared pair of helpers outside your components. The same pair handles view, text, and image recipes:

```ts
// src/lib/native-style.ts
import { style } from "@hulla/style"
import { native } from "@hulla/style-native"

export const { cn, vn } = style(native)
```

In a native component module, combine existing styles with conditional values.
React Native applies later styles last, so caller overrides go at the end:

```tsx
import { StyleSheet, View, type ViewProps } from "react-native"
import { cn } from "../lib/native-style"

const styles = StyleSheet.create({ base: { padding: 12 }, muted: { opacity: 0.5 } })

export function Surface({ muted = false, style, ...props }: ViewProps & { muted?: boolean }) {
  return <View {...props} style={cn(styles.base, muted && styles.muted, style)} />
}
```

`<Surface muted style={{ padding: 8 }} />` keeps the muted opacity and overrides
the base padding with 8. Nested arrays are passed through unchanged for React Native
to resolve. `cn` does not flatten, clone, deduplicate, or merge style objects.

## Select a named variant

Define each map once near its component. The core's shared `vn` passes the
selected value through the same composition function as `cn`. With the native
adapter, a selected style object or array retains its reference:

```ts
const $size = vn({
  compact: { padding: 8 },
  regular: { padding: 12 },
})

type Size = typeof $size.infer // "compact" | "regular"

const compact = $size("compact")
cn(compact, { paddingHorizontal: 16 })
```

Use JavaScript defaults such as `size = "regular"` for optional component props.
`vn` does not choose defaults. `.infer` is a type helper whose runtime value is
`undefined`, matching `@hulla/style`.

## Share the helpers across native components

Import the same `cn` and `vn` for view, text, and image styles. Each call keeps its
input style shape, and each variant key retains the selected value's type:

```ts
import { cn, vn } from "../lib/native-style"

const $weight = vn({ regular: { fontWeight: "400" }, strong: { fontWeight: "600" } })
const labelStyle = cn($weight("strong"), { fontSize: 14 }) // Text.style
const imageStyle = cn({ resizeMode: "cover" }) // Image.style
```

React Native checks the result against the component's own style prop. To validate
a recipe at its declaration, use `satisfies` with the target native style type:

```ts
import type { ImageStyle, TextStyle, ViewStyle } from "react-native"
import { cn } from "../lib/native-style"

const containerStyle = cn({ padding: 16 } satisfies ViewStyle)
const titleStyle = cn({ fontSize: 20, fontWeight: "600" } satisfies TextStyle)
const photoStyle = cn({ resizeMode: "cover" } satisfies ImageStyle)
```

For a whole variant map, check each entry with `Record<string, TextStyle>`:

```ts
import type { TextStyle } from "react-native"
import { vn } from "../lib/native-style"

const $weight = vn({
  regular: { fontWeight: "400" },
  strong: { fontWeight: "600" },
} satisfies Record<string, TextStyle>)

type Weight = typeof $weight.infer // "regular" | "strong"
```

`satisfies` checks the properties without converting the runtime object or
replacing the map's inferred keys. `StyleSheet.create` is another option for
static recipes. Keep the same shared `cn` and `vn` across component types.

Class strings and class-condition maps are rejected by TypeScript. Keep the preset's
identity serializer paired with its native composer; the default web serializer
would convert objects to class strings.

## Compose interactive and themed styles

React Native owns interaction callbacks. Resolve the pressed state first, then
compose its style values:

```tsx
import { Pressable, StyleSheet } from "react-native"
import { cn } from "../lib/native-style"

const styles = StyleSheet.create({ base: { padding: 12 }, pressed: { opacity: 0.7 } })

export function Action() {
  return <Pressable style={({ pressed }) => cn(styles.base, pressed && styles.pressed)} />
}
```

For `@hulla/ui`, configure `NativeThemeProvider` once and read `useNativeTheme()`
where a custom style needs tokens. Pass the resulting styles through public `style`
props, or through `Button.contentStyle` for its visible surface. The adapter does
not need theme props, subscribe to themes, or change component sizing.

## Reference and cost

| API                    | Result                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `native`               | A shared `{ serializer, composer }` object passed to `style(native)`                              |
| `cn(...styles)`        | `undefined` for no active top-level inputs; the exact input for one; an ordered array for several |
| `vn(map)(key)`         | The selected value composed through `cn`                                                          |
| `typeof variant.infer` | Union of the map's keys                                                                           |

Falsy top-level inputs are omitted, including empty variant values; nested inputs
retain their native meaning. `vn({ hidden: false })("hidden")` returns `undefined`.
Objects and arrays returned from `StyleSheet.create` can be used directly. The
adapter follows the installed React Native `StyleProp<T>` type, including style
references on versions that expose them. It does not evaluate callback functions;
call `cn` inside the callback instead.

Each `cn` call uses the existing core pipeline: it maps arguments through the
identity serializer, then calls the native composer. The mapped argument array is
new; style objects and nested arrays retain their references. Multiple active styles
produce an ordered array. This does not promise zero allocations or faster rendering.
Use stable style declarations where practical and measure representative screens
before changing styling backends. NativeWind compilation, animations, gestures,
theme subscriptions, and design tokens remain outside this package.
