import { PCT_VMA, RACE_PACE_PCT } from './config'
import { hrKarvonen, hrPercentOfMax, paceLabel } from './formulas'

export interface PaceMemoRow {
  label: string
  repLength: string
  pctRange: string
  pct: number
  paceLabel: string
  recovery: string
  /** Target HR at this zone's %VMA, via the %HRmax method — only when hrMax is provided. */
  hrPctOfMax?: number
  /** Target HR at this zone's %VMA, via Karvonen — only when both hrMax and hrRest are provided. */
  hrKarvonen?: number
}

/**
 * The live "quelle allure, quelle récup" memo table, recalculated from VMA.
 * Mirrors the prototype's reference table, standardized on the canonical
 * %VMA constants from `config.ts` (see the note in that file).
 *
 * When hrMax is supplied, each row's own %VMA doubles as the "%" in the
 * %HRmax and Karvonen formulas — the simplified per-zone HR estimate called
 * for by the spec, not a separate physiological HR-zone table.
 */
export function buildPaceMemo(vma: number, hrMax?: number, hrRest?: number): PaceMemoRow[] {
  const withHr = (row: Omit<PaceMemoRow, 'hrPctOfMax' | 'hrKarvonen'>): PaceMemoRow => ({
    ...row,
    hrPctOfMax: hrMax !== undefined ? hrPercentOfMax(hrMax, row.pct) : undefined,
    hrKarvonen: hrMax !== undefined && hrRest !== undefined ? hrKarvonen(hrRest, hrMax, row.pct) : undefined,
  })

  return [
    withHr({
      label: 'Endurance / footing',
      repLength: 'continu',
      pctRange: '65–72 %',
      pct: PCT_VMA.ef,
      paceLabel: paceLabel(vma, PCT_VMA.ef),
      recovery: '—',
    }),
    withHr({
      label: 'Sortie longue',
      repLength: 'continu',
      pctRange: '68–75 %',
      pct: PCT_VMA.longRunEasy,
      paceLabel: paceLabel(vma, PCT_VMA.longRunEasy),
      recovery: '—',
    }),
    withHr({
      label: 'Allure spécifique',
      repLength: 'blocs 2–5 km',
      pctRange: '80–90 %',
      pct: RACE_PACE_PCT[21],
      paceLabel: paceLabel(vma, RACE_PACE_PCT[21]),
      recovery: '1–2 min ou continu',
    }),
    withHr({
      label: 'Seuil',
      repLength: '1000–2000 m',
      pctRange: '88–90 %',
      pct: PCT_VMA.seuil,
      paceLabel: paceLabel(vma, PCT_VMA.seuil),
      recovery: '1–2 min',
    }),
    withHr({
      label: 'VMA longue',
      repLength: '500–1000 m',
      pctRange: '95–100 %',
      pct: PCT_VMA.vma,
      paceLabel: paceLabel(vma, PCT_VMA.vma),
      recovery: "≈ moitié de l'effort",
    }),
    withHr({
      label: 'VMA courte',
      repLength: '200–400 m / 30–45 s',
      pctRange: '100–105 %',
      pct: PCT_VMA.vmaShort,
      paceLabel: paceLabel(vma, PCT_VMA.vmaShort),
      recovery: "≈ durée de l'effort (trot)",
    }),
  ]
}
