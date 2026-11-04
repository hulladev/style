# @hulla/style

> Styling made easy.

A tiny, zero-dependency styling utility focused on two primitives:

- `cn(...)` for class composition
- `vn(...)` for flat variant maps

## Why @hulla/style?

- ✅ **Small runtime** - zero runtime dependencies
- ✅ **Works out of the box** - sane defaults with no setup required
- ✅ **Framework agnostic** - works in React, Astro, Vue, Svelte, and plain TS/JS
- ✅ **Composable architecture** - pair with `clsx`, `tailwind-merge`, or your own composer
- ✅ **Fully typesafe variants** - auto-infer component props, enforce valid variant keys, and validate params at call sites

## Comparison

| Feature                                | @hulla/style | clsx/classnames | cva     | tailwind-variants |
| -------------------------------------- | ------------ | --------------- | ------- | ----------------- |
| Class composition                      | ✅           | ✅              | ❌      | ❌                |
| Variant maps                           | ✅           | ❌              | ✅      | ✅                |
| Works with custom composers            | ✅           | ❌              | ❌      | ❌                |
| Object/array input support in composer | ✅           | ✅              | Limited | Limited           |
| Type-safe variant keys                 | ✅           | ❌              | ✅      | ✅                |
| Bundle size (minified)                 | ~0.8KB       | ~1KB            | ~2.5KB  | ~5KB              |
| Framework/styling agnostic             | ✅           | ✅              | ❌      | ❌                |

## Installation

```bash
pnpm add @hulla/style
# or npm/yarn/bun/deno
```

## Setup

For React Native style objects, use the separately installed, optional
[`@hulla/style-native`](./packages/native/README.md) adapter.
Pass it to the existing factory with `style(native)`; the core
continues to own `cn` / `vn` and does not acquire native dependencies. The
unconfigured API below continues to produce class strings.

Create one shared style module and import from it everywhere.

```ts
// src/lib/style.ts
import { style } from "@hulla/style"

export const { cn, vn } = style()

// --- Or you can also use it with more advanced composers like ---
export const { cn, vn } = style({ composer: twMerge })
```

## Creating composed classes with `cn`

The `cn` utility is a light-weight class composer you're familiar from packages like `clsx` or `twJoin`

```ts
import { cn } from "@/lib/style"

const className = cn("inline-flex items-center", ["px-4", "py-2"], { "opacity-80": true, hidden: false })

// => "inline-flex items-center px-4 py-2 opacity-80"
```

> [!TIP]
> You don't need to use tailwind. You're free to vanilla css or any other approach. Check the [examples](./examples/) section

## Creating style variants with `vn`

The `vn` utility is useful for definition various style combinations. The benefit is, it uses the defined style composer for config, so it leads to consistent and optimized results with your `cn` unlike other utilities like `cva` and
on top of that provides full typesafet for your props through `.infer`

```ts
import { vn } from "@/lib/style"

const $size = vn({
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
})

$size("sm")
// => "text-sm"
$size("lg")
// => "text-lg"
```

> [!NOTE]
> The `$prop` naming convention is not mandatory but recommended. Helps to distinguish between what's
> a `vn` function and what's your prop you use from a component. i.e. `({ size }: Props) => $size(size)`

### Using `infer` to define prop types

```ts
type Size = typeof $size.infer
// => "sm" | "md" | "lg"

// or in your component example
type Props = {
  size: typeof $size.infer
}
```

## Component Example using `cn` and `vn`

```tsx
import { cn, vn } from "@/lib/style"

const $size = vn({
  sm: "text-sm p-2",
  md: "text-base p-4",
  lg: "text-lg p-6",
})

const $variant = vn({
  primary: "text-primary bg-blue-500",
  danger: "text-danger bg-red-500",
})

type Props = {
  size?: typeof $size.infer
  variant: typeof $variant.infer
}

function Button({ variant, size = "md" }: Props) {
  return (
    <button
      className={cn(
        "rounded border hover:opacity-80", // shared base classes
        $size(size),
        $variant(variant)
      )}
    />
  )
}

// <Button variant="danger" />
// => "rounded border hover:opacity-80 text-base p-4 text-danger bg-red-500"
//     ^ base class                    ^ default size "md"  ^ variant "danger"
```

Also notice how we defined a default for `$size` making `size?: typeof $size.infer` optional parameter and in the component `({ size = "md" })` defining default value for it. This way we can define defaults for each component

Meanwhile the `variant` is mandatory (no `?:`) so if user tried `<Button />` they you would get `Mandatory type "variant" is missing in type "Props"` type-error.

This way we get full type safety and control over if each variant needs to be specified and what default values it should use.

## Configuration

The `@hulla/style` package works out of the box with just `export const { cn, vn } = style()`, but you can fully
customize it to your liking keeping consistent behaviour accross your entire codebase.

```ts
// src/lib/style.ts
import { style } from "@hulla/style"
import { twMerge } from "tailwind-merge"

export const { cn, vn } = style({
  // serializer: ... <- you can also pass a custom serializer here
  composer: twMerge,
})
```

- The `serializer` parses what gets passed into your `cn` and `vn` calls (usually stuff like parsing objects, arrays, etc)
- The `composer` transforms the `serializer` output

With the default serializer, strings go straight to the composer; only non-string inputs
are serialized. This applies with both the default composer and custom composers such as
`twMerge`. Custom composers still receive only strings, in the original argument order.
If you supply a custom serializer, it receives every input, including strings.

Default behavior:

- serializer supports strings, arrays, nested arrays, and objects, sets and maps
- default composer dedupes exact duplicate class tokens

## Native styles and custom value pipelines

The existing serializer/composer hooks can compose values other than class strings.
Generic hook types are available from `@hulla/style` 0.5.0. The optional
[native plugin](./packages/native/README.md) supplies a configuration object for these hooks:

```ts
import { style } from "@hulla/style"
import { native } from "@hulla/style-native"

export const { cn, vn } = style(native)

const $size = vn({ compact: { padding: 8 }, regular: { padding: 12 } })
cn($size("compact"), { paddingHorizontal: 16 }) // native style array
```

`native` is an object containing an identity `serializer` and a native `composer`. Style objects
pass through serialization unchanged, then the composer preserves their references
and native override order. The core still creates both `cn` and `vn` through the
same pipeline as the web helpers. Declare one shared native helper pair for view,
text, and image recipes; each call retains its own style types. There is no
separate adapter configuration property.

For custom value types, `StylePipeline<Input, Serialized, Output>` requires both
hooks. `Serializer<Input, Serialized>` converts each input, and
`Composer<Serialized, Output>` combines those results. TypeScript checks their
connection and infers the `cn` / `vn` output. Existing class configurations can
still omit either hook and use its string-based default.

## AI agent guidance

Install the [@hulla/style skill](https://github.com/hulladev/skills/tree/main/skills/style) for package-specific guidance on shared styling helpers, typed variants, merging, and native style composition:

```sh
npx skills add hulladev/skills --skill style
```

Choose your coding agent in the installer. See [installation and version compatibility](https://hulla.dev/docs/cli/agent-skills) before adding or updating skills in your application.

## Best Practices

- Keep vn declarations flat and focused (`$size`, `$variant`, `$state`) to avoid accidental class overrides.
- Use JS function param defaults (`size = "md"`) for defining variant defaults
- Put shared classes in one `cn("base here", $size(size))` base string instead of within `vn` definitions.
- Use `$`-prefixed `vn` variables to avoid `size(size)` naming collisions.

## Exports

- `style`
- `defaultSerializer`
- `defaultComposer`
- types from `types.public.ts`

## Publishing

See [the release workflow](docs/releasing.md) for changesets, version preparation, coordinated releases and npm trusted publishing.
