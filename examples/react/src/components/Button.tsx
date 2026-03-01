import { cn, vn } from "../lib/style"
import type { PropsWithChildren } from "react"

const $variant = vn({
  primary: "primary",
  secondary: "secondary",
})

export type Props = PropsWithChildren<{ variant?: typeof $variant.infer }>

export function Button(props: Props) {
  const variant = props.variant ?? "primary"

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
      <button className={cn("base", $variant(variant))}>{props.children}</button>
    </>
  )
}
