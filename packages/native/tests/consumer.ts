import { createElement } from "react"
import { Image, Pressable, StyleSheet, Text, View, type ViewProps } from "react-native"
import { style } from "@hulla/style"
import { native } from "../src"

const { cn, vn } = style(native)
const styles = StyleSheet.create({ base: { padding: 12 }, pressed: { opacity: 0.7 } })
const size = vn({ compact: { padding: 8 }, regular: { padding: 12 } })
const weight = vn({ regular: { fontWeight: "400" }, strong: { fontWeight: "600" } })

export function Consumer({ style, ...props }: ViewProps) {
  return createElement(
    View,
    { ...props, style: cn(styles.base, size("compact"), style) },
    createElement(
      Pressable,
      { style: ({ pressed }) => cn(styles.base, pressed && styles.pressed) },
      createElement(Text, { style: cn(weight("strong"), { fontVariant: ["tabular-nums"] }) }, "Save")
    ),
    createElement(Image, { source: { uri: "https://example.com/image.png" }, style: cn({ resizeMode: "cover" }) })
  )
}
