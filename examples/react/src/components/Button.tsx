import { vn } from "../lib/style"
import type { VariantProps } from "@hulla/style"
import type { PropsWithChildren } from "react"

const css = vn({
  props: {
    variant: {
      primary: "primary",
      secondary: "secondary",
    },
  },
  base: "base",
  defaults: {
    variant: "primary",
  },
})

export type Props = PropsWithChildren<VariantProps<typeof css>>

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
      <button className={css(props)}>{props.children}</button>
    </>
  )
}
