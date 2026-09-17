import { useState } from 'react'
import { DAILY_STATE_OPTIONS, getAdjustmentAdvice } from '../../lib/adjustmentGuide'
import type { AdjustmentLevel, DailyState, SessionCategory } from '../../lib/types'
import { CATEGORY_LABEL } from '../plan/SessionBadge'

const CATEGORY_OPTIONS: SessionCategory[] = ['long', 'quality', 'ef', 'renfo', 'brick', 'bike', 'race']

const LEVEL_STYLE: Record<AdjustmentLevel, { bg: string; fg: string; label: string }> = {
  proceed: { bg: 'var(--brand-soft)', fg: 'var(--brand-2)', label: 'Séance maintenue' },
  reduce: { bg: 'var(--info-soft)', fg: 'var(--info)', label: 'Séance allégée' },
  rest: { bg: 'var(--accent-soft)', fg: 'var(--accent)', label: 'Repos conseillé' },
  seek_care: { bg: 'var(--danger-soft)', fg: 'var(--danger)', label: 'Avis professionnel' },
}

export function AdjustmentGuide() {
  const [state, setState] = useState<DailyState>('fresh')
  const [category, setCategory] = useState<SessionCategory>('quality')

  const advice = getAdjustmentAdvice(state, category)
  const style = LEVEL_STYLE[advice.level]

  return (
    <div>
      <p className="mb-1 font-sans text-[25px] font-extrabold tracking-tight text-[var(--ink)]">
        Ajuster selon ta forme du jour
      </p>
      <p className="mb-5 max-w-[68ch] text-[var(--ink-2)]">
        Le plan est une trame, pas un ordre. Certains jours, la bonne décision est de lever le pied — voici comment
        trancher, selon comment tu te sens.
      </p>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
        <fieldset className="mb-4 border-0 p-0">
          <legend className="mb-2 font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Comment te sens-tu aujourd'hui ?
          </legend>
          <div className="flex flex-col gap-2">
            {DAILY_STATE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[var(--line)] p-2.5 has-[:checked]:border-[var(--brand)] has-[:checked]:bg-[var(--panel-2)]"
              >
                <input
                  type="radio"
                  name="daily-state"
                  value={opt.value}
                  checked={state === opt.value}
                  onChange={() => setState(opt.value)}
                  className="mt-1 accent-[var(--brand)]"
                />
                <span>
                  <span className="block font-sans text-[13.5px] font-bold text-[var(--ink)]">{opt.label}</span>
                  <span className="block text-[13px] text-[var(--ink-2)]">{opt.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mb-4 flex flex-col gap-1.5">
          <label
            htmlFor="planned-category"
            className="font-sans text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]"
          >
            Séance prévue aujourd'hui
          </label>
          <select
            id="planned-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as SessionCategory)}
            className="w-full rounded-lg border-[1.5px] border-[var(--line)] bg-[var(--panel)] px-2.5 py-2 font-sans text-[15px] font-semibold text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none sm:max-w-xs"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>

        <div
          role="status"
          className="rounded-xl border p-4"
          style={{ background: style.bg, borderColor: style.fg }}
        >
          <span
            className="mb-2 inline-block rounded-md px-2 py-1 font-sans text-[10px] font-extrabold uppercase tracking-wide"
            style={{ background: style.fg, color: 'white' }}
          >
            {style.label}
          </span>
          <p className="mb-1.5 font-sans text-[16px] font-extrabold" style={{ color: style.fg }}>
            {advice.headline}
          </p>
          <p className="mb-1.5 text-[14px] text-[var(--ink-2)]">{advice.advice}</p>
          {advice.swap && (
            <p className="text-[14px] text-[var(--ink-2)]">
              <b className="font-bold text-[var(--ink)]">À la place : </b>
              {advice.swap}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
