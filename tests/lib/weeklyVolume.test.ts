import { describe, expect, it } from 'vitest'
import { computeRunHours, computeWeekVolumeKm, computeWeeklyRunKm } from '../../src/lib/weeklyVolume'

describe('computeRunHours', () => {
  it('deducts ~1h per bike session from the weekly budget, never adding it', () => {
    expect(computeRunHours(8, 2)).toBe(6)
    expect(computeRunHours(8, 0)).toBe(8)
  })

  it('floors at 1.5h so a heavy bike load never zeroes out running', () => {
    expect(computeRunHours(3, 4)).toBe(1.5)
  })
})

describe('computeWeeklyRunKm', () => {
  it('golden case: 8h/week with 2 bike sessions and VMA 14 gives ~55km of running', () => {
    const runHours = computeRunHours(8, 2)
    expect(computeWeeklyRunKm(14, runHours)).toBe(55)
  })

  it('uses the full budget when there is no cycling', () => {
    const runHours = computeRunHours(5, 0)
    expect(computeWeeklyRunKm(14, runHours)).toBe(Math.round(5 * 14 * 0.66))
  })
})

describe('computeWeekVolumeKm', () => {
  const weekKm = 55

  it('race week is 35% of the nominal volume', () => {
    expect(
      computeWeekVolumeKm({ weekKm, phase: 'tap', recovery: false, race: true, taperIndex: 2 }),
    ).toBe(Math.round(weekKm * 0.35))
  })

  it('an assimilation week is 75% of the nominal volume, regardless of phase', () => {
    expect(
      computeWeekVolumeKm({ weekKm, phase: 'fond', recovery: true, race: false, taperIndex: null }),
    ).toBe(Math.round(weekKm * 0.75))
  })

  it('taper weeks follow the [0.7, 0.5, 0.4] table by taper index', () => {
    expect(
      computeWeekVolumeKm({ weekKm, phase: 'tap', recovery: false, race: false, taperIndex: 1 }),
    ).toBe(Math.round(weekKm * 0.7))
    expect(
      computeWeekVolumeKm({ weekKm, phase: 'tap', recovery: false, race: false, taperIndex: 2 }),
    ).toBe(Math.round(weekKm * 0.5))
  })

  it('clamps to the last taper slot for a 3-week taper (marathon)', () => {
    expect(
      computeWeekVolumeKm({ weekKm, phase: 'tap', recovery: false, race: false, taperIndex: 3 }),
    ).toBe(Math.round(weekKm * 0.4))
  })

  it('is the full nominal volume for a normal fondation/spécifique week', () => {
    expect(
      computeWeekVolumeKm({ weekKm, phase: 'spe', recovery: false, race: false, taperIndex: null }),
    ).toBe(weekKm)
  })
})
