import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native"

export type NativeStyle = ViewStyle | TextStyle | ImageStyle

type NativeInput = StyleProp<NativeStyle>

function composer(): undefined
function composer<const Value extends NativeInput>(style: Value): Value | undefined
function composer<const Values extends NativeInput[]>(...styles: Values): Values[number] | Values[number][] | undefined
function composer(...styles: NativeInput[]): NativeInput {
  // Only filter the fresh argument array. Keep nested arrays and style references intact.
  let count = 0
  for (const value of styles) {
    if (value) styles[count++] = value
  }
  styles.length = count
  return count > 1 ? styles : styles[0]
}

/** Pass this shared configuration to style(native) from @hulla/style. */
export const native = {
  serializer: <Value>(value: Value): Value => value,
  composer,
}
