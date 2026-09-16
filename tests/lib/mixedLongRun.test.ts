import { describe, expect, it } from 'vitest'
import { computeMixedLongRun } from '../../src/lib/mixedLongRun'
import { paceLabel } from '../../src/lib/formulas'

describe('computeMixedLongRun', () => {
  it('golden case: a semi at its 19km peak long-run target yields a 17km mixed long run (~18km, per spec)', () => {
    const result = computeMixedLongRun(21, 19, 14, 0.85)
    expect(result.reps).toBe(4)
    expect(result.totalKm).toBe(17)
    expect(result.totalKm).toBeGreaterThanOrEqual(16)
    expect(result.totalKm).toBeLessThanOrEqual(19)
  })

  it('floors the float pace% at 0.70 regardless of how slow race pace is', () => {
    // marathon race pace 0.80 - 0.05 = 0.75, still above the floor
    const marathon = computeMixedLongRun(42, 25, 14, 0.8)
    expect(marathon.floatPaceLabel).toBe(paceLabel(14, 0.75))

    // a synthetic very slow "race pace" to force the floor
    const flooredCase = computeMixedLongRun(42, 25, 14, 0.72)
    expect(flooredCase.floatPaceLabel).toBe(paceLabel(14, 0.7))
  })

  it('never generates fewer than 2 reps even on a short target distance', () => {
    const result = computeMixedLongRun(5, 6, 14, 0.92)
    expect(result.reps).toBeGreaterThanOrEqual(2)
  })

  it('uses race pace (not float pace) for the work-block label', () => {
    const result = computeMixedLongRun(10, 15, 14, 0.9)
    expect(result.workPaceLabel).toBe(paceLabel(14, 0.9))
  })

  it('renders the work/float labels as bold+muted segments, matching the prototype styling intent', () => {
    const result = computeMixedLongRun(21, 19, 14, 0.85)
    const objective = result.detail.find((seg) => seg.text === 'allure objectif')
    const recovery = result.detail.find((seg) => seg.text === 'récup active')
    expect(objective).toMatchObject({ strong: true, muted: true })
    expect(recovery).toMatchObject({ strong: true, muted: true })
  })
})
