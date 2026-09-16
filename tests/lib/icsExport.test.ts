import { describe, expect, it } from 'vitest'
import { nextMonday, planToIcs } from '../../src/lib/icsExport'
import { generatePlan } from '../../src/lib/planGenerator'
import { DEFAULT_SETTINGS } from '../../src/lib/types'

describe('nextMonday', () => {
  it('returns the same date when already a Monday', () => {
    const monday = new Date(2026, 0, 5) // 2026-01-05 is a Monday
    expect(nextMonday(monday).getDay()).toBe(1)
    expect(nextMonday(monday).getDate()).toBe(5)
  })

  it('rolls forward to the next Monday otherwise', () => {
    const wednesday = new Date(2026, 0, 7)
    const result = nextMonday(wednesday)
    expect(result.getDay()).toBe(1)
    expect(result.getTime()).toBeGreaterThan(wednesday.getTime())
  })
})

describe('planToIcs', () => {
  it('produces a well-formed VCALENDAR with one VEVENT per placed session', () => {
    const plan = generatePlan({ ...DEFAULT_SETTINGS, weeksBeforeRace: 6 })
    const ics = planToIcs(plan, new Date(2026, 0, 5))

    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true)
    expect(ics.trim().endsWith('END:VCALENDAR')).toBe(true)

    const beginCount = (ics.match(/BEGIN:VEVENT/g) ?? []).length
    const endCount = (ics.match(/END:VEVENT/g) ?? []).length
    expect(beginCount).toBe(endCount)
    expect(beginCount).toBeGreaterThan(0)
  })

  it('places the first week\'s long run on the chosen long-run day, 6 days after the start Monday', () => {
    const plan = generatePlan({ ...DEFAULT_SETTINGS, weeksBeforeRace: 8, longRunDay: 6, restDay: 0 })
    const start = new Date(2026, 0, 5) // Monday
    const ics = planToIcs(plan, start)
    const sundayDate = '20260111' // Monday 5th + 6 days = Sunday 11th
    expect(ics).toContain(`DTSTART;VALUE=DATE:${sundayDate}`)
  })
})
