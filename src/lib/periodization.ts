import {
  ASSIMILATION_EVERY_N_WEEKS,
  FONDATION_SHARE,
  REPRISE_MAX_LEVEL,
  REPRISE_MIN_WEEKS,
  TAPER_WEEKS,
} from './config'
import type { Goal, Level, Phase, PhaseSummary, WeekMeta } from './types'

export const PHASE_LABEL: Record<Phase, string> = {
  rep: 'Reprise',
  fond: 'Fondation',
  spe: 'Spécifique',
  tap: 'Affûtage',
}

export interface PhasePlan {
  summary: PhaseSummary
  weeks: WeekMeta[]
}

/**
 * Retro-plans the block structure from race day backwards: reprise (optional)
 * → fondation → spécifique → affûtage. Also flags the assimilation
 * ("recovery") weeks — every Nth week of the combined fondation+spécifique
 * build block, never the block's last week — and the race week itself.
 *
 * Ported 1:1 from the reference prototype's `build()` phase/recovery logic.
 */
export function computePhasePlan(goal: Goal, weeksBeforeRace: number, level: Level): PhasePlan {
  let taper = TAPER_WEEKS[goal]
  const repriseWeeks = weeksBeforeRace >= REPRISE_MIN_WEEKS && level < REPRISE_MAX_LEVEL ? 1 : 0

  let buildWeeks = weeksBeforeRace - taper - repriseWeeks
  if (buildWeeks < 2) {
    taper = Math.max(1, taper - 1)
    buildWeeks = weeksBeforeRace - taper - repriseWeeks
  }

  const fondationWeeks = Math.round(buildWeeks * FONDATION_SHARE)
  const specificWeeks = buildWeeks - fondationWeeks

  const phaseOf: Phase[] = []
  for (let w = 1; w <= weeksBeforeRace; w++) {
    if (w <= repriseWeeks) phaseOf.push('rep')
    else if (w > weeksBeforeRace - taper) phaseOf.push('tap')
    else if (w <= repriseWeeks + fondationWeeks) phaseOf.push('fond')
    else phaseOf.push('spe')
  }

  const buildTotal = fondationWeeks + specificWeeks
  let buildCount = 0
  const weeks: WeekMeta[] = []

  for (let w = 1; w <= weeksBeforeRace; w++) {
    const phase = phaseOf[w - 1]!
    const race = w === weeksBeforeRace
    let recovery = false
    let buildIndex: number | null = null
    let taperIndex: number | null = null

    if (phase === 'fond' || phase === 'spe') {
      buildCount++
      buildIndex = buildCount
      recovery = buildCount % ASSIMILATION_EVERY_N_WEEKS === 0 && buildCount !== buildTotal
    } else if (phase === 'tap') {
      taperIndex = w - (weeksBeforeRace - taper)
    }

    weeks.push({
      week: w,
      phase,
      phaseLabel: PHASE_LABEL[phase],
      recovery,
      race,
      buildIndex,
      taperIndex,
    })
  }

  return {
    summary: { repriseWeeks, fondationWeeks, specificWeeks, taperWeeks: taper, buildWeeks },
    weeks,
  }
}
