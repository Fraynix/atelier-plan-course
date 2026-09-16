import type { Goal, Level, RenfoStrategy } from './types'

/**
 * Every tunable coaching parameter lives here so a coach can recalibrate the
 * generator without touching the algorithm modules.
 *
 * NOTE on %VMA: the reference prototype used two slightly different constants
 * for "VMA longue"/"VMA courte" depending on whether it was rendering the
 * static pace memo (0.98 / 1.03) or generating an actual VMA session
 * (1.00 / 1.05). We standardize on the single canonical set below (matching
 * the session-generation values) everywhere, including the memo table.
 */

/** % of VMA for each named intensity zone. */
export const PCT_VMA = {
  ef: 0.68,
  longRunEasy: 0.72,
  seuil: 0.89,
  vma: 1.0,
  vmaShort: 1.05,
} as const

/** Race-pace % of VMA, by goal distance (also doubles as "allure spécifique"). */
export const RACE_PACE_PCT: Record<Goal, number> = {
  5: 0.92,
  10: 0.9,
  21: 0.85,
  42: 0.8,
}

export const GOAL_NAME: Record<Goal, string> = {
  5: '5 km',
  10: '10 km',
  21: 'Semi',
  42: 'Marathon',
}

/** Long run distance (km): start of block → peak, before level adjustment. */
export const LONG_RUN_RANGE: Record<Goal, { start: number; peak: number }> = {
  5: { start: 8, peak: 12 },
  10: { start: 10, peak: 15 },
  21: { start: 12, peak: 19 },
  42: { start: 16, peak: 30 },
}

/** Level adjustment applied to both start and peak of the long run range (km). */
export const LEVEL_LONG_RUN_ADJUSTMENT: Record<Level, number> = {
  1: -2,
  2: 0,
  3: 2,
}

/** Floor applied to the adjusted long-run start distance (km). */
export const LONG_RUN_MIN_START_KM = 6

/** Taper length in weeks, by goal. */
export const TAPER_WEEKS: Record<Goal, number> = {
  5: 2,
  10: 2,
  21: 2,
  42: 3,
}

/** Minimum weeks (and level) required to insert a 1-week "reprise" phase. */
export const REPRISE_MIN_WEEKS = 9
export const REPRISE_MAX_LEVEL: Level = 3

/** Fondation share of the build block (fondation + spécifique), rounded. */
export const FONDATION_SHARE = 0.45

/** Assimilation (lightened) week cadence within the build block. */
export const ASSIMILATION_EVERY_N_WEEKS = 3
export const ASSIMILATION_LONG_RUN_FACTOR = 0.75
export const ASSIMILATION_VOLUME_FACTOR = 0.75

/** Long-run taper fraction of peak, indexed by taper week (1-based). */
export const TAPER_LONG_RUN_FRACTION: Record<2 | 3, number[]> = {
  3: [0.7, 0.5, 0.35],
  2: [0.55, 0.4],
}

/** Overall weekly-volume taper fraction, always this 3-slot table (clamped). */
export const TAPER_VOLUME_FRACTION = [0.7, 0.5, 0.4]

/** Race week volume as a fraction of the nominal weekly km. */
export const RACE_WEEK_VOLUME_FACTOR = 0.35

/** Running-volume estimate: km/week = runHours × VMA × this factor. */
export const RUN_VOLUME_SPEED_FACTOR = 0.66

/** Hours deducted from the weekly budget per bike session. */
export const HOURS_PER_BIKE_SESSION = 1.0

/** Floor applied to weekly running hours after deducting bike sessions. */
export const MIN_RUN_HOURS = 1.5

/** Mixed (varied-pace) long run block config, by goal: work/float/warm-up/cool-down km. */
export const MIXED_LONG_RUN: Record<Goal, { work: number; float: number; warmup: number; cooldown: number }> = {
  5: { work: 1, float: 1, warmup: 2, cooldown: 2 },
  10: { work: 2, float: 1, warmup: 3, cooldown: 2 },
  21: { work: 2, float: 1, warmup: 3, cooldown: 2 },
  42: { work: 3, float: 1, warmup: 4, cooldown: 3 },
}

/** Float (recovery) pace = race pace − this offset, floored at MIXED_LONG_RUN_MIN_FLOAT_PCT. */
export const MIXED_LONG_RUN_FLOAT_OFFSET = 0.05
export const MIXED_LONG_RUN_MIN_FLOAT_PCT = 0.7
export const MIXED_LONG_RUN_MIN_REPS = 2

export const DEFAULT_RENFO_STRATEGY: RenfoStrategy = 'easy-day'

/** Minimum run sessions/week required to add a 2nd ("entretien") quality session in spécifique. */
export const SECOND_QUALITY_MIN_SESSIONS = 5

export const DAY_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const
