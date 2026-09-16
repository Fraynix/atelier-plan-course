import type { Plan } from '../../lib/types'

function StatCard({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="min-w-[104px] rounded-[11px] border border-[var(--line)] bg-[var(--panel-2)] px-3.5 py-2.5">
      <div className="font-sans text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className="font-sans text-[19px] font-extrabold text-[var(--ink)]">
        {value}
        {unit && <small className="text-[0.6em] font-bold text-[var(--muted)]"> {unit}</small>}
      </div>
    </div>
  )
}

const PHASE_LEGEND: { key: string; label: string; dotClass: string }[] = [
  { key: 'rep', label: 'Reprise', dotClass: 'bg-[var(--muted)]' },
  { key: 'fond', label: 'Fondation', dotClass: 'bg-[var(--brand)]' },
  { key: 'spe', label: 'Spécifique', dotClass: 'bg-[var(--info)]' },
  { key: 'tap', label: 'Affûtage', dotClass: 'bg-[var(--accent)]' },
]

export function PlanSummary({ plan }: { plan: Plan }) {
  return (
    <div className="mb-4.5">
      <div className="mb-4 flex flex-wrap gap-2.5">
        <StatCard label="Objectif" value={plan.meta.goalName} />
        <StatCard label="Allure cible" value={plan.meta.kmPaceLabel} unit="/km" />
        <StatCard label="Durée du plan" value={plan.meta.weeks} unit="sem." />
        <StatCard label="Fondation" value={plan.meta.fondationWeeks} unit="sem." />
        <StatCard label="Spécifique" value={plan.meta.specificWeeks} unit="sem." />
        <StatCard label="Affûtage" value={plan.meta.taperWeeks} unit="sem." />
        <StatCard label="Volume course" value={`~${plan.meta.weekKm}`} unit="km/sem" />
        {plan.meta.bikeSessionsPerWeek > 0 && (
          <StatCard
            label="Vélo"
            value={plan.meta.bikeSessionsPerWeek}
            unit={`séance${plan.meta.bikeSessionsPerWeek > 1 ? 's' : ''}/sem`}
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {PHASE_LEGEND.map((p) => (
          <span key={p.key} className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[var(--ink-2)]">
            <i className={`inline-block h-2.5 w-2.5 rounded-[3px] ${p.dotClass}`} />
            {p.label}
          </span>
        ))}
        <span className="text-xs text-[var(--muted)]">Ligne grisée = semaine allégée (récup)</span>
      </div>
    </div>
  )
}
