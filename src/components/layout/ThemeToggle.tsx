import type { ThemePreference } from '../../hooks/useTheme'

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Auto' },
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
]

export function ThemeToggle({ theme, onChange }: { theme: ThemePreference; onChange: (t: ThemePreference) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Thème de l'interface"
      className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--panel-2)] p-0.5 font-sans text-xs font-semibold"
    >
      {OPTIONS.map((opt) => {
        const active = theme === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={
              'rounded-[7px] px-3 py-1.5 transition-colors ' +
              (active ? 'bg-[var(--brand)] text-white' : 'text-[var(--ink-2)] hover:text-[var(--ink)]')
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
