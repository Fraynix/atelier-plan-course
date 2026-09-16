import { describe, expect, it } from 'vitest'
import { adjustedLongRunRange, longRunKmForWeek } from '../../src/lib/longRun'
import { computePhasePlan } from '../../src/lib/periodization'

describe('adjustedLongRunRange', () => {
  it('shifts start/peak by the level adjustment, flooring start at 6km', () => {
    expect(adjustedLongRunRange(21, 2)).toEqual({ start: 12, peak: 19 })
    expect(adjustedLongRunRange(21, 3)).toEqual({ start: 14, peak: 21 })
    expect(adjustedLongRunRange(21, 1)).toEqual({ start: 10, peak: 17 })
    // 5km prudent: 8-2=6 floors exactly at the minimum
    expect(adjustedLongRunRange(5, 1)).toEqual({ start: 6, peak: 10 })
  })
})

describe('longRunKmForWeek', () => {
  it('reprise week is 70% of the adjusted start distance', () => {
    const km = longRunKmForWeek({
      goal: 21,
      level: 2,
      phase: 'rep',
      recovery: false,
      buildIndex: null,
      buildTotal: 9,
      taperIndex: null,
      taperWeeks: 2,
    })
    expect(km).toBe(Math.round(12 * 0.7))
  })

  it('interpolates linearly from start to peak across the build block', () => {
    const buildTotal = 9
    const first = longRunKmForWeek({
      goal: 21,
      level: 2,
      phase: 'fond',
      recovery: false,
      buildIndex: 1,
      buildTotal,
      taperIndex: null,
      taperWeeks: 2,
    })
    const last = longRunKmForWeek({
      goal: 21,
      level: 2,
      phase: 'spe',
      recovery: false,
      buildIndex: buildTotal,
      buildTotal,
      taperIndex: null,
      taperWeeks: 2,
    })
    expect(first).toBe(12) // start
    expect(last).toBe(19) // peak, never dampened since the last build week is never a recovery week
  })

  it('dampens an assimilation week to 75% of the interpolated trend', () => {
    const buildTotal = 9
    const buildIndex = 3
    const trend = 12 + ((buildIndex - 1) / (buildTotal - 1)) * (19 - 12)
    const km = longRunKmForWeek({
      goal: 21,
      level: 2,
      phase: 'fond',
      recovery: true,
      buildIndex,
      buildTotal,
      taperIndex: null,
      taperWeeks: 2,
    })
    expect(km).toBe(Math.round(trend * 0.75))
  })

  it('applies the 2-week taper fraction table [0.55, 0.4] to the peak', () => {
    const week1 = longRunKmForWeek({
      goal: 21,
      level: 2,
      phase: 'tap',
      recovery: false,
      buildIndex: null,
      buildTotal: 9,
      taperIndex: 1,
      taperWeeks: 2,
    })
    const week2 = longRunKmForWeek({
      goal: 21,
      level: 2,
      phase: 'tap',
      recovery: false,
      buildIndex: null,
      buildTotal: 9,
      taperIndex: 2,
      taperWeeks: 2,
    })
    expect(week1).toBe(Math.round(19 * 0.55))
    expect(week2).toBe(Math.round(19 * 0.4))
  })

  it('applies the 3-week taper fraction table [0.7, 0.5, 0.35] for marathon', () => {
    const range = adjustedLongRunRange(42, 2)
    const week3 = longRunKmForWeek({
      goal: 42,
      level: 2,
      phase: 'tap',
      recovery: false,
      buildIndex: null,
      buildTotal: 10,
      taperIndex: 3,
      taperWeeks: 3,
    })
    expect(week3).toBe(Math.round(range.peak * 0.35))
  })

  it('golden case: the semi long run peaks around 19km mid-build, feeding a ~17-18km mixed long run', () => {
    const plan = computePhasePlan(21, 12, 2)
    const peakWeek = plan.weeks
      .filter((w) => w.phase === 'fond' || w.phase === 'spe')
      .reduce((a, b) => (b.buildIndex! > a.buildIndex! ? b : a))
    const km = longRunKmForWeek({
      goal: 21,
      level: 2,
      phase: peakWeek.phase,
      recovery: peakWeek.recovery,
      buildIndex: peakWeek.buildIndex,
      buildTotal: plan.summary.buildWeeks,
      taperIndex: peakWeek.taperIndex,
      taperWeeks: plan.summary.taperWeeks,
    })
    expect(km).toBe(19)
  })
})
