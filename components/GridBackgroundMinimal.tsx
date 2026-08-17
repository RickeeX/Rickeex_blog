export default function GridBackgroundMinimal() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] select-none overflow-hidden bg-[#fdfbf7] bg-[linear-gradient(to_right,rgb(243_244_246)_1px,transparent_1px),linear-gradient(to_bottom,rgb(243_244_246)_1px,transparent_1px)] bg-[size:24px_24px] transition-colors duration-500 dark:bg-gray-950 dark:bg-[linear-gradient(to_right,rgb(31_41_55_/_0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(31_41_55_/_0.35)_1px,transparent_1px)]">
      <div
        className="absolute left-1/2 top-[35%] hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 dark:block sm:h-[900px] sm:w-[900px]"
        style={{
          background: 'radial-gradient(circle, rgba(192, 38, 211, 0.35) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
