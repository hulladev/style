# @hulla/style

> **Styling made easy** 🎨  
> A unified, type-safe styling library that works with any CSS framework or methodology.

[![npm version](https://img.shields.io/npm/v/@hulla/style.svg)](https://www.npmjs.com/package/@hulla/style)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why @hulla/style?

**@hulla/style** is a tiny (~1KB), zero-dependency library that unifies class name composition with powerful variant management. Unlike other solutions, it works consistently across any composer (clsx, tailwind-merge, etc.) and provides first-class TypeScript support.

### The Problem

When building component libraries, you often need to:
- Compose class names conditionally
- Define component variants (sizes, colors, states)
- Combine multiple variants together
- Use different CSS frameworks (Tailwind, vanilla CSS, CSS modules)
- Ensure type safety for all variants

Most libraries solve only part of this puzzle, forcing you to combine multiple tools or compromise on features.

### The Solution

**@hulla/style** provides a unified API that:
- ✅ **Works with any composer** - Use with clsx, tailwind-merge, or vanilla strings
- ✅ **Handles complex types** - Objects, arrays, nested structures work everywhere
- ✅ **Type-safe variants** - Get autocomplete and type checking for all variants
- ✅ **Composable architecture** - Mix variants, groups, and raw strings seamlessly
- ✅ **Framework agnostic** - Works with React, Vue, Astro, Svelte, or plain HTML
- ✅ **Zero dependencies** - Tiny bundle size, no external deps required
- ✅ **Extensible** - Customize serialization and composition behavior

## Comparison with Alternatives

| Feature | @hulla/style | clsx/classnames | cva | tailwind-variants |
|---------|--------------|-----------------|-----|-------------------|
| Class composition | ✅ | ✅ | ❌ | ❌ |
| Variant management | ✅ | ❌ | ✅ | ✅ |
| Variant groups | ✅ | ❌ | ❌ | Limited |
| Object syntax support | ✅ Everywhere | ✅ Only cn | ❌ | ❌ |
| Works with any composer | ✅ | N/A | ❌ tw only | ❌ tw only |
| Customizable serialization | ✅ | ❌ | ❌ | ❌ |
| Bundle size | ~1KB | ~1KB | ~2.5KB | ~5KB |
| TypeScript support | ✅ Full | Partial | ✅ Full | ✅ Full |
| Framework agnostic | ✅ | ✅ | ✅ | ❌ React only |

## Installation

```bash
npm install @hulla/style
# or
pnpm add @hulla/style
# or
yarn add @hulla/style
# or
bun add @hulla/style
```

## Quick Start

```typescript
import { style, type VariantProps } from '@hulla/style'

// Create your style utilities
const { cn, variant, variantGroup } = style()

// Use cn for simple class composition
const buttonClass = cn('px-4 py-2', 'rounded', 'bg-blue-500')
// => "px-4 py-2 rounded bg-blue-500"

// Define variants for reusable component styles
const button = variant({
  name: 'variant',
  classes: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
  },
  base: 'px-4 py-2 rounded font-semibold',
  default: 'primary'
})

button.css() // => "px-4 py-2 rounded font-semibold bg-blue-500 text-white"
button.css('secondary') // => "px-4 py-2 rounded font-semibold bg-gray-500 text-white"

type Props = VariantProps<typeof button> // { variant?: 'primary' | 'secondary' }
```

## Core Concepts

### 1. Class Name Composition (`cn`)

The `cn` function composes class names, supporting strings, arrays, objects, Sets, and Maps:

```typescript
const { cn } = style()

// Strings
cn('foo', 'bar') // => "foo bar"

// Arrays
cn(['foo', 'bar']) // => "foo bar"

// Objects (keys with truthy values)
cn({ foo: true, bar: false, baz: true }) // => "foo baz"

// Mixed
cn('base', ['hover:bg-blue'], { active: true, disabled: false })
// => "base hover:bg-blue active"

// Nested
cn('base', ['text-lg', { bold: true, italic: false }])
// => "base text-lg bold"
```

### 2. Variants

Variants define reusable component styles with different states:

```typescript
const button = variant({
  name: 'size',
  classes: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  },
  base: 'rounded font-semibold transition-colors',
  default: 'md'
})

button.css('sm')  // => "rounded font-semibold transition-colors text-sm px-2 py-1"
button.css('md')  // => "rounded font-semibold transition-colors text-base px-4 py-2"
button.css()      // => "rounded font-semibold transition-colors text-base px-4 py-2" (default)
```

#### Array Classes

```typescript
const button = variant({
  name: 'variant',
  classes: {
    primary: ['bg-blue-500', 'text-white', 'hover:bg-blue-600'],
    secondary: ['bg-gray-500', 'text-white', 'hover:bg-gray-600'],
  },
  default: 'primary'
})
```

#### Object Classes

```typescript
const button = variant({
  name: 'state',
  classes: {
    active: { 'bg-blue-500': true, 'text-white': true, 'opacity-50': false },
    disabled: { 'bg-gray-300': true, 'cursor-not-allowed': true },
  },
  default: 'active'
})
```

#### TypeScript Integration

```typescript
import type { VariantProps } from '@hulla/style'

const button = variant({
  name: 'variant',
  classes: {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
  },
  default: 'primary'
})

type ButtonProps = VariantProps<typeof button>
// ButtonProps = { variant?: 'primary' | 'secondary' }

function Button({ variant }: ButtonProps) {
  return <button className={button.css(variant)} />
}
```

### 3. Variant Groups

Combine multiple variants for more complex component APIs:

```typescript
const size = variant({
  name: 'size',
  classes: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  },
  default: 'md'
})

const variant = variant({
  name: 'variant',
  classes: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    danger: 'bg-red-500 text-white',
  },
  default: 'primary'
})

const buttonStyles = variantGroup(size, variant)

// Use with defaults
buttonStyles.css({})
// => "text-base px-4 py-2 bg-blue-500 text-white"

// Override specific variants
buttonStyles.css({ size: 'lg', variant: 'danger' })
// => "text-lg px-6 py-3 bg-red-500 text-white"

// TypeScript support
type ButtonProps = VariantProps<typeof buttonStyles>
// ButtonProps = { size?: 'sm' | 'md' | 'lg', variant?: 'primary' | 'secondary' | 'danger' }
```

### 4. Composing Everything Together

Mix `cn`, variants, and variant groups seamlessly:

```typescript
const { cn, variant, variantGroup } = style()

const size = variant({
  name: 'size',
  classes: { sm: 'text-sm', lg: 'text-lg' },
  default: 'sm'
})

const color = variant({
  name: 'color',
  classes: { blue: 'text-blue-500', red: 'text-red-500' },
  default: 'blue'
})

const styles = variantGroup(size, color)

// Compose with additional classes
const finalClass = cn(
  'base-class',
  styles.css({ size: 'lg', color: 'red' }),
  'hover:opacity-80',
  { active: true }
)
// => "base-class text-lg text-red-500 hover:opacity-80 active"
```

## Advanced Usage

### Custom Composers

Use @hulla/style with your preferred class name library:

```typescript
import { style } from '@hulla/style'
import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

// With tailwind-merge (handles Tailwind class conflicts)
const { cn, variant, variantGroup } = style({ composer: twMerge })

// With clsx
const { cn, variant, variantGroup } = style({ composer: clsx })

// Objects, arrays, and nested structures work with ANY composer!
cn({ 'text-blue-500': true, 'bg-white': false }, ['px-4', 'py-2'])
```

### Custom Serialization

Override how class names are serialized:

```typescript
import { style, defaultComposer } from '@hulla/style'

const { cn, variant, variantGroup } = style({
  serializer: (input) => {
    // Custom logic to convert input to string
    if (typeof input === 'string') return input
    // ... your custom serialization
    return ''
  },
  composer: defaultComposer
})
```

### Variants Without Defaults

For more explicit APIs, create variants without defaults:

```typescript
const button = variant({
  name: 'variant',
  classes: {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
  },
  // No default specified
})

// TypeScript enforces passing a variant
button.css('primary') // ✅ OK
button.css()          // ❌ TypeScript error: prop is required
```

## Real-World Examples

### React Button Component

```tsx
import { style } from '@hulla/style'
import type { VariantProps } from '@hulla/style'
import { twMerge } from 'tailwind-merge'

const { cn, variant, variantGroup } = style({ composer: twMerge })

const buttonSize = variant({
  name: 'size',
  classes: {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  },
  default: 'md'
})

const buttonVariant = variant({
  name: 'variant',
  classes: {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  },
  default: 'primary'
})

const buttonStyles = variantGroup(buttonSize, buttonVariant)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>

export function Button({ size, variant, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded font-semibold transition-colors disabled:opacity-50',
        buttonStyles.css({ size, variant }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Usage
<Button size="lg" variant="danger" className="custom-class">
  Delete
</Button>
```

### Astro Component

```astro
---
import { style } from '@hulla/style'
import type { VariantProps } from '@hulla/style'

const { variant, variantGroup } = style()

const size = variant({
  name: 'size',
  classes: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
  },
  default: 'md'
})

const color = variant({
  name: 'color',
  classes: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
  },
  default: 'primary'
})

const buttonStyles = variantGroup(size, color)

type Props = VariantProps<typeof buttonStyles>
const props = Astro.props
---

<button class={buttonStyles.css(props)}>
  <slot />
</button>
```

### Vue Component

```vue
<script setup lang="ts">
import { style } from '@hulla/style'
import type { VariantProps } from '@hulla/style'

const { cn, variant, variantGroup } = style()

const size = variant({
  name: 'size',
  classes: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
  },
  default: 'md'
})

const buttonVariant = variant({
  name: 'variant',
  classes: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
  },
  default: 'primary'
})

const buttonStyles = variantGroup(size, buttonVariant)

type ButtonProps = VariantProps<typeof buttonStyles>

interface Props extends ButtonProps {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const classes = computed(() => 
  cn(
    'rounded transition-colors',
    buttonStyles.css({ size: props.size, variant: props.variant }),
    props.class
  )
)
</script>

<template>
  <button :class="classes">
    <slot />
  </button>
</template>
```

## API Reference

### `style(config?)`

Creates style utilities with optional configuration.

```typescript
const { cn, variant, variantGroup } = style({
  serializer?: (input: ClassName) => string,
  composer?: (...strings: string[]) => string
})
```

**Parameters:**
- `config.serializer` - Custom function to serialize class name inputs to strings
- `config.composer` - Custom function to compose strings (e.g., `clsx`, `twMerge`)

**Returns:**
- `cn` - Function to compose class names
- `variant` - Function to create variants
- `variantGroup` - Function to create variant groups

### `cn(...classes)`

Composes class names from various input types.

```typescript
cn(
  'string',
  ['array', 'of', 'strings'],
  { objectKey: boolean },
  nestedStructures
)
```

### `variant(definition)`

Creates a variant with multiple style options.

```typescript
const myVariant = variant({
  name: string,              // Variant name (for variantGroup)
  classes: Record<string, ClassName>,  // Style definitions
  base?: string,             // Base classes applied to all variants
  default?: keyof classes    // Default variant (optional)
})

myVariant.css(key?) // Returns class string
myVariant.params    // Access variant definition
```

### `variantGroup(...variants)`

Combines multiple variants into a single API.

```typescript
const group = variantGroup(variant1, variant2, ...)

group.css(props)  // Returns composed class string
group.params      // Access all variant definitions
```

### Type Helpers

```typescript
import type { VariantProps, ClassName, Serializer, Composer } from '@hulla/style'

// Extract props type from variant or variant group
type Props = VariantProps<typeof myVariantOrGroup>
```

## License

MIT © [Samuel Hulla](https://hulla.dev)

## Contributing

Contributions are welcome! Please check out our [GitHub repository](https://github.com/hulladev/style).

