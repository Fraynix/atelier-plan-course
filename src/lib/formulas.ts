/**
 * Pure math: VMA → speed → pace/time/distance, and heart-rate zones.
 *
 * Rounding rule (single source of truth): whenever a duration in seconds is
 * derived from a speed, it is rounded to the nearest whole second exactly
 * once, at the point of derivation. `formatPace` then only ever formats an
 * already-integer number of seconds — it never re-rounds a fractional value.
 * This replaces the reference prototype's `fmtPace`, which rounded the
 * seconds-remainder separately from the floored minutes.
 */

/** Target speed (km/h) for a given %VMA. */
export function speedFromVma(vma: number, pct: number): number {
  return vma * pct
}

/** Seconds per km at a given speed (km/h), rounded once to the nearest second. */
export function paceSecondsPerKm(speedKmh: number): number {
  return Math.round(3600 / speedKmh)
}

/** Formats a whole number of seconds as `m:ss`. Carries 60s into the next minute. */
export function formatDuration(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds)
  const m = Math.floor(rounded / 60)
  const s = rounded % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Convenience: pace label (`m:ss`) for a given VMA and %VMA. */
export function paceLabel(vma: number, pct: number): string {
  return formatDuration(paceSecondsPerKm(speedFromVma(vma, pct)))
}

/**
 * Time (seconds) to cover a distance (m) at a given speed (km/h).
 * `distance_m × 3.6 / vitesse` — the 3.6 converts km/h to m/s.
 */
export function timeForDistanceSeconds(distanceM: number, speedKmh: number): number {
  return Math.round((distanceM * 3.6) / speedKmh)
}

/** Time (seconds) to cover a distance (m) at a given VMA and %VMA, as `m:ss`. */
export function timeForDistanceLabel(distanceM: number, vma: number, pct: number): string {
  return formatDuration(timeForDistanceSeconds(distanceM, speedFromVma(vma, pct)))
}

/**
 * Distance (m) covered in a given duration (s) at a given speed (km/h).
 * The inverse of `timeForDistanceSeconds`: `vitesse / 3.6 × durée`.
 */
export function distanceForDuration(speedKmh: number, durationS: number): number {
  return (speedKmh / 3.6) * durationS
}

/** % of HRmax method: returns the target heart rate. */
export function hrPercentOfMax(hrMax: number, pct: number): number {
  return Math.round(hrMax * pct)
}

/** Karvonen method: HRrepos + %×(HRmax−HRrepos). */
export function hrKarvonen(hrRest: number, hrMax: number, pct: number): number {
  return Math.round(hrRest + pct * (hrMax - hrRest))
}
