import { PCT_VMA, RACE_PACE_PCT } from './config'
import { paceLabel } from './formulas'

export interface PaceMemoRow {
  label: string
  repLength: string
  pctRange: string
  pct: number
  paceLabel: string
  recovery: string
}

/**
 * The live "quelle allure, quelle récup" memo table, recalculated from VMA.
 * Mirrors the prototype's reference table, standardized on the canonical
 * %VMA constants from `config.ts` (see the note in that file).
 */
export function buildPaceMemo(vma: number): PaceMemoRow[] {
  return [
    {
      label: 'Endurance / footing',
      repLength: 'continu',
      pctRange: '65–72 %',
      pct: PCT_VMA.ef,
      paceLabel: paceLabel(vma, PCT_VMA.ef),
      recovery: '—',
    },
    {
      label: 'Sortie longue',
      repLength: 'continu',
      pctRange: '68–75 %',
      pct: PCT_VMA.longRunEasy,
      paceLabel: paceLabel(vma, PCT_VMA.longRunEasy),
      recovery: '—',
    },
    {
      label: 'Allure spécifique',
      repLength: 'blocs 2–5 km',
      pctRange: '80–90 %',
      pct: RACE_PACE_PCT[21],
      paceLabel: paceLabel(vma, RACE_PACE_PCT[21]),
      recovery: '1–2 min ou continu',
    },
    {
      label: 'Seuil',
      repLength: '1000–2000 m',
      pctRange: '88–90 %',
      pct: PCT_VMA.seuil,
      paceLabel: paceLabel(vma, PCT_VMA.seuil),
      recovery: '1–2 min',
    },
    {
      label: 'VMA longue',
      repLength: '500–1000 m',
      pctRange: '95–100 %',
      pct: PCT_VMA.vma,
      paceLabel: paceLabel(vma, PCT_VMA.vma),
      recovery: "≈ moitié de l'effort",
    },
    {
      label: 'VMA courte',
      repLength: '200–400 m / 30–45 s',
      pctRange: '100–105 %',
      pct: PCT_VMA.vmaShort,
      paceLabel: paceLabel(vma, PCT_VMA.vmaShort),
      recovery: "≈ durée de l'effort (trot)",
    },
  ]
}
