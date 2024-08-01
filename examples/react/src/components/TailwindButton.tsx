import { vn } from "../lib/style"
import type { VariantProps } from "@hulla/style"
import type { PropsWithChildren } from "react"

const css = vn({
  base: "border-2 p-2 hover:opacity-80",
  props: {
    variant: {
      primary: "text-lime-400 border-lime-400",
      secondary: "text-teal-300 border-teal-300",
    },
    size: {
      sm: "text-sm",
      md: "text-md",
    },
  },
  defaults: {
    variant: "primary",
  },
})

export type Props = PropsWithChildren<VariantProps<typeof css>>

export function TailwindButton(props: Props) {
  return <button className={css(props)}>{props.children}</button>
}
