export function HeartRateFields({
  hrMax,
  hrRest,
  onChangeHrMax,
  onChangeHrRest,
}: {
  hrMax: number | undefined
  hrRest: number | undefined
  onChangeHrMax: (v: number | undefined) => void
  onChangeHrRest: (v: number | undefined) => void
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="hrmax" className="font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
          FC max (optionnel)
        </label>
        <input
          id="hrmax"
          type="number"
          min={120}
          max={230}
          step={1}
          value={hrMax ?? ''}
          onChange={(e) => onChangeHrMax(e.target.value === '' ? undefined : Number(e.target.value))}
          className="w-full rounded-lg border-[1.5px] border-[var(--line)] bg-[var(--panel)] px-2.5 py-2 font-sans text-[15px] font-semibold text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="hrrest" className="font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
          FC repos (optionnel)
        </label>
        <input
          id="hrrest"
          type="number"
          min={30}
          max={100}
          step={1}
          value={hrRest ?? ''}
          onChange={(e) => onChangeHrRest(e.target.value === '' ? undefined : Number(e.target.value))}
          className="w-full rounded-lg border-[1.5px] border-[var(--line)] bg-[var(--panel)] px-2.5 py-2 font-sans text-[15px] font-semibold text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none"
        />
      </div>
    </>
  )
}
