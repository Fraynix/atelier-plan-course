import { useMemo } from 'react'
import { DAY_NAMES } from '../../lib/config'
import { assignWeekDays } from '../../lib/scheduler'
import type { Plan } from '../../lib/types'
import { DetailText } from './DetailText'
import { SessionBadge } from './SessionBadge'

export function WeekDetail({ plan, weekIndex }: { plan: Plan; weekIndex: number }) {
  const week = plan.weeks[weekIndex]

  const days = useMemo(() => {
    if (!week) return null
    return assignWeekDays(week.sessions, {
      restDay: plan.meta.restDay,
      longRunDay: plan.meta.longRunDay,
      renfoStrategy: plan.meta.renfoStrategy,
      race: week.race,
    })
  }, [week, plan.meta.restDay, plan.meta.longRunDay, plan.meta.renfoStrategy])

  if (!week || !days) return null

  const runCount = week.sessions.filter((s) => s.category === 'long' || s.category === 'quality' || s.category === 'ef' || s.category === 'race').length
  const bikeCount = week.sessions.filter((s) => s.category === 'bike').length

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
        <span className="font-sans text-[19px] font-extrabold text-[var(--ink)]">Semaine {week.week}</span>
        <span className="font-sans text-[12.5px] font-semibold text-[var(--muted)]">
          {week.phaseLabel}
          {week.recovery ? ' · assimilation' : ''}
        </span>
        <span className="font-sans text-[12.5px] font-semibold text-[var(--muted)]">
          · {week.sessions.length} séances (dont {runCount} à pied{bikeCount ? `, ${bikeCount} vélo` : ''}) · ~
          {week.volumeKm} km course
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {days.map((sessions, dayIndex) => {
          const isRest = sessions.length === 0
          return (
            <div
              key={dayIndex}
              className="grid grid-cols-[92px_1fr] items-stretch overflow-hidden rounded-[11px] border border-[var(--line)] bg-[var(--panel)]"
            >
              <div
                className={
                  'flex items-center bg-[var(--panel-2)] px-3 py-2.5 font-sans text-[12.5px] font-extrabold ' +
                  (isRest ? 'text-[var(--muted)]' : 'text-[var(--ink)]')
                }
              >
                {DAY_NAMES[dayIndex]}
              </div>
              {isRest ? (
                <div className="px-3 py-2.5 font-sans text-[13px] font-semibold text-[var(--muted)]">
                  Repos / récupération
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 px-3 py-2.5">
                  {sessions.map((session, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <SessionBadge category={session.category} className="w-[72px]" />
                      <div className="text-[13.5px] text-[var(--ink-2)]">
                        <span className="mb-0.5 block font-sans text-[13.5px] font-bold text-[var(--ink)]">
                          {session.title}
                        </span>
                        <DetailText segments={session.detail} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 text-[12.5px] text-[var(--muted)]">
        💡 Ajuste le jour de repos et de sortie longue dans le formulaire. Les séances dures sont espacées d'au moins
        48 h ; le renfo se cale selon la stratégie choisie.
      </div>
    </div>
  )
}
