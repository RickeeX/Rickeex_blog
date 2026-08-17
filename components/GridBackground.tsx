export default function GridBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1] select-none overflow-hidden bg-white dark:bg-gray-950"
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-grid-glow bg-[linear-gradient(to_right,rgb(229_231_235_/_0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgb(229_231_235_/_0.55)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgb(31_41_55_/_0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgb(31_41_55_/_0.4)_1px,transparent_1px)]" />
    </div>
  )
}
