import { describe, expect, it } from 'vitest'
import { computePhasePlan } from '../../src/lib/periodization'

describe('computePhasePlan', () => {
  it('adds a 1-week reprise only when weeks>=9 and level<3', () => {
    expect(computePhasePlan(21, 12, 2).summary.repriseWeeks).toBe(1)
    expect(computePhasePlan(21, 8, 2).summary.repriseWeeks).toBe(0)
    expect(computePhasePlan(21, 12, 3).summary.repriseWeeks).toBe(0)
  })

  it('tapers 3 weeks for marathon, 2 weeks for everything else', () => {
    expect(computePhasePlan(42, 16, 2).summary.taperWeeks).toBe(3)
    expect(computePhasePlan(21, 12, 2).summary.taperWeeks).toBe(2)
    expect(computePhasePlan(10, 12, 2).summary.taperWeeks).toBe(2)
    expect(computePhasePlan(5, 12, 2).summary.taperWeeks).toBe(2)
  })

  it('shrinks the taper by 1 (floor 1) when the build block would be under 2 weeks', () => {
    // weeks=4, level=2, goal=42: taper=3, reprise=0 -> buildWeeks=1 <2 -> taper=2, buildWeeks=2
    const plan = computePhasePlan(42, 4, 2)
    expect(plan.summary.taperWeeks).toBe(2)
    expect(plan.summary.buildWeeks).toBe(2)
  })

  it('splits the build block ~45/55 between fondation and spécifique', () => {
    const plan = computePhasePlan(21, 12, 2)
    // weeks=12, taper=2, reprise=1 -> build=9 -> fond=round(9*0.45)=4, spe=5
    expect(plan.summary.fondationWeeks).toBe(4)
    expect(plan.summary.specificWeeks).toBe(5)
    expect(plan.summary.fondationWeeks + plan.summary.specificWeeks).toBe(plan.summary.buildWeeks)
  })

  it('produces exactly one phase entry per week, ending on affûtage/race', () => {
    const plan = computePhasePlan(21, 12, 2)
    expect(plan.weeks).toHaveLength(12)
    const last = plan.weeks.at(-1)!
    expect(last.phase).toBe('tap')
    expect(last.race).toBe(true)
    expect(plan.weeks.filter((w) => w.race)).toHaveLength(1)
  })

  it('flags assimilation weeks every 3rd build week, never the block\'s last week', () => {
    const plan = computePhasePlan(21, 12, 2)
    const buildWeeks = plan.weeks.filter((w) => w.phase === 'fond' || w.phase === 'spe')
    const recoveryIndexes = buildWeeks.filter((w) => w.recovery).map((w) => w.buildIndex)
    expect(recoveryIndexes).toEqual([3, 6])
    const lastBuildWeek = buildWeeks.at(-1)!
    expect(lastBuildWeek.recovery).toBe(false)
  })

  it('never marks a session-generating week with no phase', () => {
    const plan = computePhasePlan(5, 6, 1)
    for (const w of plan.weeks) {
      expect(['rep', 'fond', 'spe', 'tap']).toContain(w.phase)
    }
  })
})
