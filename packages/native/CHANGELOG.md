# @hulla/style-native

## 1.1.0

### Minor Changes

- 995ac1e: Add a separate native color entry point with opacity, OKLab mixing, and lightness utilities. Keep the composition preset free of runtime imports and make its core peer optional for color-only consumers.

### Patch Changes

- @hulla/style@1.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [cf46bf2]
  - @hulla/style@1.0.1

## 1.0.0

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

### Patch Changes

- Updated dependencies
  - @hulla/style@0.5.0
