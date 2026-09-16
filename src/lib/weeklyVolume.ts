import {
  ASSIMILATION_VOLUME_FACTOR,
  HOURS_PER_BIKE_SESSION,
  MIN_RUN_HOURS,
  RACE_WEEK_VOLUME_FACTOR,
  RUN_VOLUME_SPEED_FACTOR,
  TAPER_VOLUME_FRACTION,
} from './config'
import type { Phase } from './types'

/**
 * Running hours available this week: cycling is DEDUCTED from the weekly
 * budget (≈1h/session), never added on top of it. Floored at 1.5h so a
 * heavy bike load never collapses the running volume to near-zero.
 */
export function computeRunHours(hoursPerWeek: number, bikeSessionsPerWeek: number): number {
  const bikeHours = bikeSessionsPerWeek * HOURS_PER_BIKE_SESSION
  return Math.max(MIN_RUN_HOURS, hoursPerWeek - bikeHours)
}

/** Nominal weekly running volume (km), estimated from available run hours and VMA. */
export function computeWeeklyRunKm(vma: number, runHours: number): number {
  return Math.round(runHours * vma * RUN_VOLUME_SPEED_FACTOR)
}

export interface WeekVolumeInput {
  weekKm: number
  phase: Phase
  recovery: boolean
  race: boolean
  /** 1-based index within the taper block; required when phase is 'tap'. */
  taperIndex: number | null
}

/**
 * Applies the week-type modifier to the nominal weekly km: race week is 35%
 * of it, an assimilation week is 75%, a taper week follows the
 * [0.7, 0.5, 0.4] table (clamped to its last slot), everything else is the
 * full nominal volume.
 */
export function computeWeekVolumeKm(input: WeekVolumeInput): number {
  if (input.race) {
    return Math.round(input.weekKm * RACE_WEEK_VOLUME_FACTOR)
  }
  if (input.recovery) {
    return Math.round(input.weekKm * ASSIMILATION_VOLUME_FACTOR)
  }
  if (input.phase === 'tap') {
    const taperIndex = input.taperIndex ?? 1
    const slot = Math.min(TAPER_VOLUME_FRACTION.length - 1, taperIndex - 1)
    const fraction = TAPER_VOLUME_FRACTION[slot]!
    return Math.round(input.weekKm * fraction)
  }
  return input.weekKm
}
