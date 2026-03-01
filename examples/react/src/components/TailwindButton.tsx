import { cn, vn } from "../lib/style"
import type { PropsWithChildren } from "react"

const $variant = vn({
  primary: "text-lime-400 border-lime-400",
  secondary: "text-teal-300 border-teal-300",
})

const $size = vn({
  sm: "text-sm",
  md: "text-base",
})

type T = { variant?: typeof $variant.infer; size?: typeof $size.infer }

export type Props = PropsWithChildren<T>

export function TailwindButton(props: Props) {
  const variant = props.variant ?? "primary"
  const size = props.size ?? "md"

  return (
    <button className={cn("border-2 p-2 hover:opacity-80", $variant(variant), $size(size))}>{props.children}</button>
  )
}
