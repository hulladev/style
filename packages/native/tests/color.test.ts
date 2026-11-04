import { describe, expect, it, vi } from "vitest"
import Color from "colorjs.io"

// Isolate the platform color parser; the production helper uses React Native's processColor.
vi.mock("react-native", () => ({
  processColor(value: string) {
    let color: Color
    try {
      color = new Color(value).to("srgb")
    } catch {
      return undefined
    }
    const byte = (number: number) => Math.round(Math.max(0, Math.min(1, number)) * 255)
    return (
      ((byte(color.alpha) << 24) |
        (byte(color.coords[0]!) << 16) |
        (byte(color.coords[1]!) << 8) |
        byte(color.coords[2]!)) >>>
      0
    )
  },
}))
const { alpha, mix, isDark } = await import("../src/color")

describe("native color recipes", () => {
  it("preserves alpha and matches premultiplied OKLab mixing", () => {
    expect(alpha("red", 0.2)).toBe("#ff000033")
    expect(alpha("#12345680", 0.5)).toBe("#12345640")
    expect(alpha("rgba(12,34,56,0.5)", 0.5)).toBe("#0c223840")
    expect(alpha("red", -1)).toBe("#ff000000")
    expect(alpha("red", 2)).toBe("#ff0000ff")
    expect(alpha("not-a-color", 0.5)).toBe("not-a-color")
    expect(mix("red", "not-a-color", 0.5)).toBe("red")
    for (const [base, overlay] of [
      ["#fcfeff", "#c83a35"],
      ["#040404", "#f36069"],
      ["#2258e5", "#050c1e"],
      ["#2258e5", "transparent"],
      ["#12345680", "#ffcc0077"],
    ]) {
      for (const amount of [0, 0.03, 0.16, 0.5, 0.82, 1]) {
        const actual = new Color(mix(base!, overlay!, amount)).to("srgb")
        const expected = new Color(base!)
          .mix(new Color(overlay!), amount, { space: "oklab", premultiplied: true })
          .to("srgb")
        actual.coords.forEach((value, index) =>
          expect(
            Math.abs(value - Math.min(1, Math.max(0, expected.coords[index]!))),
            `${base}/${overlay}/${amount}: channel ${index}`
          ).toBeLessThanOrEqual(2 / 255)
        )
        expect(Math.abs(actual.alpha - expected.alpha)).toBeLessThanOrEqual(2 / 255)
      }
    }
  })
  it("uses background lightness for palettes without an explicit mode", () => {
    expect(isDark("#040404")).toBe(true)
    expect(isDark("#f3faff")).toBe(false)
    expect(isDark("not-a-color")).toBe(false)
  })
})
