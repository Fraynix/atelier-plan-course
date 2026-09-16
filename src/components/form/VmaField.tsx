export function VmaField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="vma" className="font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
        VMA (km/h)
      </label>
      <input
        id="vma"
        type="number"
        min={8}
        max={24}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby="vma-hint"
        className="w-full rounded-lg border-[1.5px] border-[var(--line)] bg-[var(--panel)] px-2.5 py-2 font-sans text-[15px] font-semibold text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none"
      />
      <span id="vma-hint" className="font-sans text-[11px] font-medium text-[var(--muted)]">
        test demi-Cooper : distance 6 min ÷ 100
      </span>
    </div>
  )
}
