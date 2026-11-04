# @hulla/style

## 1.1.0

No changes in this release.

## 1.0.1

### Patch Changes

- cf46bf2: Normalize published package metadata and introduce coordinated release preparation with verified npm artifacts. GitHub Release announcements remain disabled by default.

## 0.5.0

### Minor Changes

- Generalize the existing serializer and composer types to support non-string input,
  intermediate, and output values. `style({ serializer, composer })` now infers typed
  `cn` and `vn` helpers for these pipelines without adding a runtime branch or changing
  the default class-string behavior.

  Add the optional `@hulla/style-native` plugin. Pass `native` directly to `style()`;
  it supplies an identity serializer and a native composer through the existing hooks.
  The core owns the shared variant implementation and acquires no native dependencies.

  Emit matching ESM and CommonJS declarations so both module formats can type-check
  the factory and optional plugin together.

  Preserve polymorphic composer call signatures with an identity serializer and a
  single-value-preserving composer. Native consumers can use one `cn` / `vn` pair
  for view, text, and image recipes without fixing the whole instance to one style
  type or widening every result to a broad union.

## 0.4.0

### Minor Changes

- Skip serialization for string inputs and normalize other inputs without allocating a second argument array. Preserve custom serializer behavior for both cn and vn.

## 0.3.0

### Minor Changes

- Simplif vn syntax to flat structure

## 0.2.2

### Patch Changes

- change .d.mts to .d.ts stubs

## 0.2.1

### Patch Changes

- fixes cornercase with recursive type resolution on VariantProps

## 0.2.0

### Minor Changes

- New variants syntax

## 0.1.0

### Minor Changes

- new props syntax, modifiers, better VariantProps

## 0.0.2

### Patch Changes

- use exact class:list definition from astro

## 0.0.1

### Patch Changes

- 89974e4: Beta release

## 0.0.0

### Patch Changes

- Beta release of @hulla/style
