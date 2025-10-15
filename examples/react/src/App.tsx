import { Button } from "./components/Button"
import { TailwindButton, TailwindButtonMerged } from "./components/TailwindButton"
import "./index.css"

function App() {
  return (
    <main className="bg-black/95 h-screen w-screen space-y-8">
      <section className="border space-y-4 p-8 space-x-4">
        <h3 className="text-white text-3xl mx-4">Vanilla css</h3>
        <Button>Primary button (default)</Button>
        <Button variant="secondary">Secondary button</Button>
      </section>
      <section className="border space-y-4 p-8 space-x-4">
        <h3 className="text-white text-3xl mx-4">Tailwindcss</h3>
        <TailwindButton size="md">Primary button (default)</TailwindButton>
        <TailwindButton size="md" variant="secondary">
          Secondary button
        </TailwindButton>
        <TailwindButtonMerged size="md">Primary button (merged)</TailwindButtonMerged>
        <TailwindButtonMerged size="md" variant="secondary">
          Secondary button (merged)
        </TailwindButtonMerged>
      </section>
    </main>
  )
}

export default App
