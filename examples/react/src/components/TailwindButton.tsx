import { cn, variant, variantGroup } from "../lib/style"
import type { VariantProps } from "@hulla/style"
import type { PropsWithChildren } from "react"

const buttonVariant = variant({
  name: "variant",
  classes: {
    primary: "text-lime-400 border-lime-400",
    secondary: "text-teal-300 border-teal-300",
  },
  base: "border-2 p-2 hover:opacity-80",
  default: "primary",
})

const sizeVariant = variant({
  name: "size",
  classes: {
    sm: "text-sm",
    md: "text-md",
  },
})

type T = VariantProps<typeof sizeVariant> & VariantProps<typeof buttonVariant>

export type Props = PropsWithChildren<T>

export function TailwindButton(props: Props) {
  return <button className={cn(buttonVariant.css(props.variant), sizeVariant.css(props.size))}>{props.children}</button>
}

const group = variantGroup(buttonVariant, sizeVariant)

type MergedProps = PropsWithChildren<VariantProps<typeof group>>

export function TailwindButtonMerged(props: MergedProps) {
  return <button className={group.css({ variant: props.variant, size: props.size })}>{props.children}</button>
}
