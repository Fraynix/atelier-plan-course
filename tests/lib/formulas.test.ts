import { describe, expect, it } from 'vitest'
import {
  distanceForDuration,
  formatDuration,
  hrKarvonen,
  hrPercentOfMax,
  paceLabel,
  paceSecondsPerKm,
  speedFromVma,
  timeForDistanceLabel,
  timeForDistanceSeconds,
} from '../../src/lib/formulas'

describe('speedFromVma', () => {
  it('scales VMA by the intensity percentage', () => {
    expect(speedFromVma(14, 0.85)).toBeCloseTo(11.9, 10)
  })
})

describe('formatDuration', () => {
  it('formats whole seconds as m:ss, zero-padded', () => {
    expect(formatDuration(303)).toBe('5:03')
    expect(formatDuration(60)).toBe('1:00')
    expect(formatDuration(5)).toBe('0:05')
  })

  it('carries a rounded 60s remainder into the next minute', () => {
    // 119.6 rounds to 120s, i.e. 2:00 — not 1:60.
    expect(formatDuration(119.6)).toBe('2:00')
  })

  it('rounds a fractional input exactly once', () => {
    expect(formatDuration(302.521)).toBe('5:03')
  })
})

describe('paceSecondsPerKm + paceLabel (golden values)', () => {
  it('VMA 14 at semi race pace (85%) is close to 5:03/km', () => {
    // vitesse = 14 × 0.85 = 11.9 km/h → 3600/11.9 = 302.52s → round → 303s = 5:03
    expect(paceSecondsPerKm(speedFromVma(14, 0.85))).toBe(303)
    expect(paceLabel(14, 0.85)).toBe('5:03')
  })

  it('VMA 14 at EF (68%) matches the manual computation', () => {
    const speed = 14 * 0.68 // 9.52 km/h
    const expectedSeconds = Math.round(3600 / speed)
    expect(paceSecondsPerKm(speedFromVma(14, 0.68))).toBe(expectedSeconds)
  })
})

describe('timeForDistanceSeconds / timeForDistanceLabel', () => {
  it('matches the 400m and 1000m shortcuts from the spec', () => {
    const vma = 14
    const pct = 1.0 // VMA pace
    const speed = speedFromVma(vma, pct) // 14 km/h
    expect(timeForDistanceSeconds(400, speed)).toBe(Math.round(1440 / speed))
    expect(timeForDistanceSeconds(1000, speed)).toBe(Math.round(3600 / speed))
  })

  it('produces a sane m:ss label for a 400m rep at VMA', () => {
    // 14 km/h → 400m in 1440/14 = 102.86s ≈ 1:43
    expect(timeForDistanceLabel(400, 14, 1.0)).toBe('1:43')
  })
})

describe('distanceForDuration (inverse of timeForDistanceSeconds)', () => {
  it('recovers ~400m from its own computed time at the same speed', () => {
    const speed = speedFromVma(14, 1.0)
    const seconds = timeForDistanceSeconds(400, speed)
    expect(distanceForDuration(speed, seconds)).toBeCloseTo(400, -1)
  })

  it('matches the 105% / 30s worked example from the prototype (~122m)', () => {
    const speed = speedFromVma(14, 1.05) // 14.7 km/h
    expect(distanceForDuration(speed, 30)).toBeCloseTo(122.5, 1)
  })
})

describe('heart-rate helpers', () => {
  it('computes %HRmax', () => {
    expect(hrPercentOfMax(190, 0.7)).toBe(133)
  })

  it('computes Karvonen', () => {
    // 60 + 0.7 × (190 − 60) = 151
    expect(hrKarvonen(60, 190, 0.7)).toBe(151)
  })
})
