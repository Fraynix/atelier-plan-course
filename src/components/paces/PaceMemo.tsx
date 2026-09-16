import { buildPaceMemo } from '../../lib/paceReferences'

export function PaceMemo({ vma, hrMax, hrRest }: { vma: number; hrMax?: number; hrRest?: number }) {
  const rows = buildPaceMemo(vma, hrMax, hrRest)
  const showHr = hrMax !== undefined
  const showKarvonen = showHr && hrRest !== undefined

  const headers = ['Type de séance', 'Longueur de rép.', '% VMA', 'Ton allure', 'Récupération']
  if (showHr) headers.push('FC (% max)')
  if (showKarvonen) headers.push('FC (Karvonen)')

  return (
    <div className="noprint">
      <p className="mb-1 font-sans text-[25px] font-extrabold tracking-tight text-[var(--ink)]">
        Quelle allure sur quelle distance, quelle récup
      </p>
      <p className="mb-5 max-w-[68ch] text-[var(--ink-2)]">
        Les briques de séance, avec les allures calculées <b>en direct pour ta VMA</b> — change-la dans le
        formulaire ci-dessus.
        {showHr && " Les zones de fréquence cardiaque sont une estimation : reprends le %VMA de chaque zone comme repère, pas une mesure exacte."}
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
        <table className="w-full min-w-[560px] border-collapse bg-[var(--panel)] text-[13.5px]">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="bg-[var(--panel-2)] px-2.5 py-2 text-left font-sans text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[var(--line-2)]">
                <td className="px-2.5 py-2 font-sans font-extrabold text-[var(--ink)]">{row.label}</td>
                <td className="px-2.5 py-2 text-[var(--ink-2)]">{row.repLength}</td>
                <td className="px-2.5 py-2 text-[var(--ink-2)]">{row.pctRange}</td>
                <td className="whitespace-nowrap px-2.5 py-2 font-mono font-bold text-[var(--brand-2)]">
                  {row.paceLabel}/km
                </td>
                <td className="px-2.5 py-2 text-[var(--ink-2)]">{row.recovery}</td>
                {showHr && (
                  <td className="whitespace-nowrap px-2.5 py-2 font-mono font-bold text-[var(--info)]">
                    {row.hrPctOfMax} bpm
                  </td>
                )}
                {showKarvonen && (
                  <td className="whitespace-nowrap px-2.5 py-2 font-mono font-bold text-[var(--info)]">
                    {row.hrKarvonen} bpm
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
