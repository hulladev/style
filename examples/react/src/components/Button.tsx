import { variant } from "../lib/style"
import type { VariantProps } from "@hulla/style"
import type { PropsWithChildren } from "react"

const buttonVariant = variant({
  name: "variant",
  classes: {
    primary: "primary",
    secondary: "secondary",
  },
  base: "base",
  default: "primary",
})

export type Props = PropsWithChildren<VariantProps<typeof buttonVariant>>

export function Button(props: Props) {
  return (
    <>
      {/* in a real-world scenario you'd probably define your own .css file and import it, but i wanted to */}
      {/* make examples concise and not confuse with separate .css file thats not used in tailwind example */}
      <style>{`
        .primary {
          color: greenyellow;
        }
        .secondary {
          color: aquamarine;
        }
        .base {
          border: 2px solid;
          padding: 0.5rem;
        }
        .base:hover {
          opacity: 0.8;
        }
      `}</style>
      <button className={buttonVariant.css(props.variant)}>{props.children}</button>
    </>
  )
}
