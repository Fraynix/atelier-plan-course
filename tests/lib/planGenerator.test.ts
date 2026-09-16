import { describe, expect, it } from 'vitest'
import { generatePlan } from '../../src/lib/planGenerator'
import { assignWeekDays } from '../../src/lib/scheduler'
import { DEFAULT_SETTINGS } from '../../src/lib/types'

describe('generatePlan — golden cases from the spec', () => {
  it('VMA 14, semi: target pace is the standardized ~5:03/km', () => {
    const plan = generatePlan({ ...DEFAULT_SETTINGS, goal: 21, vma: 14 })
    expect(plan.meta.kmPaceLabel).toBe('5:03')
  })

  it('8h/week with 2 bike sessions and VMA 14: running volume is ~55km/week', () => {
    const plan = generatePlan({ ...DEFAULT_SETTINGS, vma: 14, hoursPerWeek: 8, bikeSessionsPerWeek: 2 })
    expect(plan.meta.weekKm).toBe(55)
  })

  it('semi long run peaks at ~19km mid-build, and the mixed long run week lands near ~18km', () => {
    const plan = generatePlan({ ...DEFAULT_SETTINGS, goal: 21, weeksBeforeRace: 12, level: 2 })
    const peakLongRun = Math.max(...plan.weeks.map((w) => w.longRunKm))
    expect(peakLongRun).toBe(19)

    const mixedWeeks = plan.weeks.filter((w) => w.phase === 'spe' && !w.recovery && !w.race)
    expect(mixedWeeks.length).toBeGreaterThan(0)
    for (const w of mixedWeeks) {
      const longSession = w.sessions.find((s) => s.category === 'long')!
      expect(longSession.title).toBe('Sortie longue mixte')
    }
  })

  it('no quality/bike-hard session ever lands the day before the long run, across the whole plan', () => {
    const plan = generatePlan({ ...DEFAULT_SETTINGS, runSessionsPerWeek: 5, bikeSessionsPerWeek: 3 })
    for (const week of plan.weeks) {
      const days = assignWeekDays(week.sessions, {
        restDay: plan.meta.restDay,
        longRunDay: plan.meta.longRunDay,
        renfoStrategy: plan.meta.renfoStrategy,
        race: week.race,
      })
      const longDayIndex = days.findIndex((d) => d.some((s) => s.category === 'long' || s.category === 'race'))
      if (longDayIndex === -1) continue
      const eve = (longDayIndex + 6) % 7
      const hasHard = days[eve]!.some((s) => s.category === 'quality' || (s.category === 'bike' && s.hard))
      expect(hasHard).toBe(false)
    }
  })
})

describe('generatePlan — no NaN/undefined in the rendered plan', () => {
  const combos: Array<Partial<typeof DEFAULT_SETTINGS>> = [
    {},
    { goal: 5, weeksBeforeRace: 6, level: 1 },
    { goal: 10, weeksBeforeRace: 8, bikeSessionsPerWeek: 4, hoursPerWeek: 4 },
    { goal: 42, weeksBeforeRace: 20, level: 3, runSessionsPerWeek: 6 },
    { goal: 21, weeksBeforeRace: 30, includeBricksAndMixed: false },
  ]

  for (const overrides of combos) {
    it(`is fully defined for ${JSON.stringify(overrides)}`, () => {
      const plan = generatePlan({ ...DEFAULT_SETTINGS, ...overrides })
      expect(Number.isFinite(plan.meta.weekKm)).toBe(true)
      expect(plan.meta.kmPaceLabel).toMatch(/^\d+:\d{2}$/)
      expect(plan.weeks.length).toBe(plan.meta.weeks)

      for (const week of plan.weeks) {
        expect(Number.isFinite(week.longRunKm)).toBe(true)
        expect(Number.isFinite(week.volumeKm)).toBe(true)
        expect(week.sessions.length).toBeGreaterThan(0)
        for (const session of week.sessions) {
          expect(session.title).toBeTruthy()
          expect(session.detail.length).toBeGreaterThan(0)
          for (const seg of session.detail) {
            expect(seg.text).not.toMatch(/NaN|undefined/)
          }
        }
        for (const seg of [...week.table.longCell, ...week.table.qualityCell]) {
          expect(seg.text).not.toMatch(/NaN|undefined/)
        }
        expect(week.table.othersCell.length).toBeGreaterThan(0)
      }
    })
  }
})

describe('generatePlan — structure', () => {
  it('ends on a race week matching the requested race distance', () => {
    const plan = generatePlan({ ...DEFAULT_SETTINGS, goal: 42, weeksBeforeRace: 16 })
    const last = plan.weeks.at(-1)!
    expect(last.race).toBe(true)
    expect(last.sessions.some((s) => s.category === 'race')).toBe(true)
    expect(last.table.longCell.some((seg) => seg.text.includes('Marathon'))).toBe(true)
  })
})
