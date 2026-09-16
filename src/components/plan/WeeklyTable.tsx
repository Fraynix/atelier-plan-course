import type { Plan } from '../../lib/types'
import { DetailText } from './DetailText'

const PHASE_BADGE_CLASS: Record<string, string> = {
  rep: 'bg-[var(--panel-3)] text-[var(--muted)]',
  fond: 'bg-[var(--brand-soft)] text-[var(--brand-2)]',
  spe: 'bg-[var(--info-soft)] text-[var(--info)]',
  tap: 'bg-[var(--accent-soft)] text-[var(--accent)]',
}

export function WeeklyTable({
  plan,
  selectedWeek,
  onSelectWeek,
}: {
  plan: Plan
  selectedWeek: number
  onSelectWeek: (weekIndex: number) => void
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
      <table className="w-full min-w-[680px] border-collapse bg-[var(--panel)] text-[13.5px]">
        <thead>
          <tr>
            {['Sem.', 'Sortie longue', 'Séance(s) de qualité', 'Autres séances', 'Vol.'].map((h) => (
              <th
                key={h}
                className="sticky top-0 bg-[var(--panel-2)] px-2.5 py-2 text-left font-sans text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plan.weeks.map((week, i) => (
            <tr
              key={week.week}
              onClick={() => onSelectWeek(i)}
              aria-current={selectedWeek === i}
              className={
                'cursor-pointer border-b border-[var(--line-2)] align-top ' +
                (week.race
                  ? 'bg-[var(--brand-soft)] font-bold'
                  : week.recovery
                    ? 'bg-[var(--panel-2)]'
                    : selectedWeek === i
                      ? 'bg-[var(--panel-3)]'
                      : '')
              }
            >
              <td className="whitespace-nowrap px-2.5 py-2 font-sans font-extrabold">
                S{week.week}
                <br />
                <span
                  className={
                    'mt-0.5 inline-block rounded px-1.5 py-0.5 font-sans text-[9.5px] font-extrabold uppercase tracking-wide ' +
                    PHASE_BADGE_CLASS[week.phase]
                  }
                >
                  {week.phaseLabel}
                  {week.recovery ? ' · récup' : ''}
                </span>
              </td>
              <td className="px-2.5 py-2 text-[var(--ink-2)]">
                <DetailText segments={week.table.longCell} />
              </td>
              <td className="px-2.5 py-2 text-[var(--ink-2)]">
                <DetailText segments={week.table.qualityCell} />
              </td>
              <td className="px-2.5 py-2 text-[var(--ink-2)]">
                {week.table.othersCell.map((line, idx) => (
                  <span key={idx}>
                    {idx > 0 && <br />}
                    {line}
                  </span>
                ))}
              </td>
              <td className="px-2.5 py-2 font-mono font-bold text-[var(--brand-2)]">~{week.volumeKm} km</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
