import { DAY_NAMES } from '../../lib/config'
import type { DayIndex, Goal, Level, RenfoStrategy, UserSettings } from '../../lib/types'
import { HeartRateFields } from './HeartRateFields'
import { VmaField } from './VmaField'

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 21, label: 'Semi-marathon' },
  { value: 42, label: 'Marathon' },
]

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: 1, label: 'Prudent (reprise)' },
  { value: 2, label: 'Régulier' },
  { value: 3, label: 'Solide (déjà du volume)' },
]

const RENFO_STRATEGY_OPTIONS: { value: RenfoStrategy; label: string }[] = [
  { value: 'easy-day', label: 'Jour facile' },
  { value: 'quality-day', label: 'Jour de séance de qualité' },
  { value: 'dedicated-day', label: 'Jour dédié' },
]

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </label>
      {children}
    </div>
  )
}

const selectClass =
  'w-full rounded-lg border-[1.5px] border-[var(--line)] bg-[var(--panel)] px-2.5 py-2 font-sans text-[15px] font-semibold text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none'
const numberClass = selectClass

export function SettingsForm({
  settings,
  onChange,
  onReset,
}: {
  settings: UserSettings
  onChange: (next: UserSettings) => void
  onReset: () => void
}) {
  const set = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => onChange({ ...settings, [key]: value })

  return (
    <form
      className="noprint grid grid-cols-1 gap-3.5 rounded-t-2xl border-b border-[var(--line)] bg-[var(--panel-2)] p-5 sm:grid-cols-2 lg:grid-cols-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <Field label="Objectif" htmlFor="goal">
        <select
          id="goal"
          className={selectClass}
          value={settings.goal}
          onChange={(e) => set('goal', Number(e.target.value) as Goal)}
        >
          {GOAL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <VmaField value={settings.vma} onChange={(v) => set('vma', v)} />

      <Field label="Semaines avant l'objectif" htmlFor="weeks">
        <input
          id="weeks"
          type="number"
          min={4}
          max={30}
          step={1}
          value={settings.weeksBeforeRace}
          onChange={(e) => set('weeksBeforeRace', Math.max(4, Math.min(30, Number(e.target.value) || 4)))}
          className={numberClass}
        />
      </Field>

      <Field label="Heures dispo / semaine" htmlFor="hours">
        <input
          id="hours"
          type="number"
          min={2}
          max={15}
          step={0.5}
          value={settings.hoursPerWeek}
          onChange={(e) => set('hoursPerWeek', Number(e.target.value))}
          className={numberClass}
        />
      </Field>

      <Field label="Séances course / semaine" htmlFor="sessions">
        <input
          id="sessions"
          type="number"
          min={3}
          max={6}
          step={1}
          value={settings.runSessionsPerWeek}
          onChange={(e) => set('runSessionsPerWeek', Math.max(3, Math.min(6, Number(e.target.value) || 3)))}
          className={numberClass}
        />
      </Field>

      <Field label="Séances vélo / semaine" htmlFor="bike">
        <input
          id="bike"
          type="number"
          min={0}
          max={4}
          step={1}
          value={settings.bikeSessionsPerWeek}
          onChange={(e) => set('bikeSessionsPerWeek', Math.max(0, Math.min(4, Number(e.target.value) || 0)))}
          aria-describedby="bike-hint"
          className={numberClass}
        />
        <span id="bike-hint" className="font-sans text-[11px] font-medium text-[var(--muted)]">
          0 si tu ne fais que courir · déduit des heures dispo
        </span>
      </Field>

      <Field label="Point de départ" htmlFor="level">
        <select
          id="level"
          className={selectClass}
          value={settings.level}
          onChange={(e) => set('level', Number(e.target.value) as Level)}
        >
          {LEVEL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Jour de repos" htmlFor="restday">
        <select
          id="restday"
          className={selectClass}
          value={settings.restDay}
          onChange={(e) => set('restDay', Number(e.target.value) as DayIndex)}
        >
          {DAY_NAMES.map((name, i) => (
            <option key={name} value={i}>
              {name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Jour de sortie longue" htmlFor="longday">
        <select
          id="longday"
          className={selectClass}
          value={settings.longRunDay}
          onChange={(e) => set('longRunDay', Number(e.target.value) as DayIndex)}
        >
          {DAY_NAMES.map((name, i) => (
            <option key={name} value={i}>
              {name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Renfo apparié à…" htmlFor="renfostrategy">
        <select
          id="renfostrategy"
          className={selectClass}
          value={settings.renfoStrategy}
          onChange={(e) => set('renfoStrategy', e.target.value as RenfoStrategy)}
        >
          {RENFO_STRATEGY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <HeartRateFields
        hrMax={settings.hrMax}
        hrRest={settings.hrRest}
        onChangeHrMax={(v) => set('hrMax', v)}
        onChangeHrRest={(v) => set('hrRest', v)}
      />

      <div className="col-span-full flex flex-row items-center gap-2">
        <input
          id="mixte"
          type="checkbox"
          checked={settings.includeBricksAndMixed}
          onChange={(e) => set('includeBricksAndMixed', e.target.checked)}
          className="h-4 w-4 accent-[var(--brand)]"
        />
        <label htmlFor="mixte" className="text-[13.5px] font-semibold text-[var(--ink-2)]">
          Intégrer des enchaînements vélo→course (briques) &amp; séances mixtes — utile en triathlon &amp; pour
          absorber du volume sans traumatisme
        </label>
      </div>

      <div className="col-span-full flex flex-wrap items-center gap-2.5 pt-0.5">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border-[1.5px] border-[var(--line)] bg-transparent px-5 py-2.5 font-sans text-sm font-extrabold text-[var(--brand-2)]"
        >
          Réinitialiser
        </button>
      </div>
    </form>
  )
}
