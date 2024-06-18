import { vn } from "../lib/style"
import type { VariantProps } from "@hulla/style"
import type { PropsWithChildren } from "react"

const css = vn({
  variants: {
    primary: "primary",
    secondary: "secondary",
  },
  base: "base",
  defaultVariant: "primary",
})

export type Props = PropsWithChildren<VariantProps<typeof css>>

export function TailwindButton(props: Props) {
  return <button className={css(props)}>{props.children}</button>
}
