import {
  ASSIMILATION_LONG_RUN_FACTOR,
  LEVEL_LONG_RUN_ADJUSTMENT,
  LONG_RUN_MIN_START_KM,
  LONG_RUN_RANGE,
  TAPER_LONG_RUN_FRACTION,
} from './config'
import type { Goal, Level, Phase } from './types'

export interface LongRunRange {
  start: number
  peak: number
}

/** Long-run start/peak (km) for this goal, adjusted for starting level. */
export function adjustedLongRunRange(goal: Goal, level: Level): LongRunRange {
  const base = LONG_RUN_RANGE[goal]
  const adjustment = LEVEL_LONG_RUN_ADJUSTMENT[level]
  return {
    start: Math.max(LONG_RUN_MIN_START_KM, base.start + adjustment),
    peak: base.peak + adjustment,
  }
}

export interface LongRunWeekInput {
  goal: Goal
  level: Level
  phase: Phase
  recovery: boolean
  /** 1-based index within the fondation+spécifique build block (null outside it). */
  buildIndex: number | null
  /** Total weeks in the build block (fondation+spécifique). */
  buildTotal: number
  /** 1-based index within the taper block (null outside it). */
  taperIndex: number | null
  taperWeeks: number
}

/**
 * Long-run target distance (km) for a single week.
 *
 * - Reprise: 70% of the (adjusted) start distance.
 * - Fondation/Spécifique: linear interpolation from start → peak across the
 *   build block, dropped to 75% on an assimilation week.
 * - Affûtage: a fraction of the peak distance, per taper week.
 */
export function longRunKmForWeek(input: LongRunWeekInput): number {
  const range = adjustedLongRunRange(input.goal, input.level)

  if (input.phase === 'rep') {
    return Math.round(range.start * 0.7)
  }

  if (input.phase === 'tap') {
    const taperIndex = input.taperIndex ?? 1
    const table = input.taperWeeks === 3 ? TAPER_LONG_RUN_FRACTION[3] : TAPER_LONG_RUN_FRACTION[2]
    const frac = table[taperIndex - 1] ?? table[table.length - 1]!
    return Math.round(range.peak * frac)
  }

  // fondation / spécifique
  const buildIndex = input.buildIndex ?? 1
  const fr = input.buildTotal > 1 ? (buildIndex - 1) / (input.buildTotal - 1) : 1
  const base = range.start + fr * (range.peak - range.start)
  return Math.round(input.recovery ? base * ASSIMILATION_LONG_RUN_FACTOR : base)
}
