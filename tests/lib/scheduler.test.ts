import { describe, expect, it } from 'vitest'
import { assignWeekDays } from '../../src/lib/scheduler'
import {
  bikeEasySession,
  bikeHardSession,
  brickSession,
  deblocageSession,
  efSession,
  qualitySession,
  raceDaySession,
  raceRenfoSession,
  renfoSession,
} from '../../src/lib/sessionCatalog'
import type { DayIndex, RenfoStrategy, Session } from '../../src/lib/types'
import { longRunSession } from '../../src/lib/sessionCatalog'

function typicalWeekSessions(opts: { efCount: number; bikeHard: number; bikeEasy: number; brick: boolean }): Session[] {
  const sessions: Session[] = []
  sessions.push(longRunSession({ goal: 21, phase: 'spe', recovery: false, longRunKm: 16, vma: 14, racePct: 0.85 }).session)
  sessions.push(qualitySession({ phase: 'spe', recovery: false, taperIndex: null, taperWeeks: 2, vma: 14, racePct: 0.85, runSessionsPerWeek: 4 }).primary)
  for (let i = 0; i < opts.efCount; i++) sessions.push(efSession(14))
  for (let i = 0; i < opts.bikeHard; i++) sessions.push(bikeHardSession())
  for (let i = 0; i < opts.bikeEasy; i++) sessions.push(bikeEasySession())
  if (opts.brick) sessions.push(brickSession('spe'))
  sessions.push(renfoSession('spe'))
  return sessions
}

describe('assignWeekDays — structure', () => {
  it('places nothing on the rest day', () => {
    const sessions = typicalWeekSessions({ efCount: 2, bikeHard: 0, bikeEasy: 0, brick: false })
    const days = assignWeekDays(sessions, { restDay: 0, longRunDay: 6, renfoStrategy: 'easy-day', race: false })
    expect(days[0]).toHaveLength(0)
  })

  it('places the long run on the chosen long-run day', () => {
    const sessions = typicalWeekSessions({ efCount: 2, bikeHard: 0, bikeEasy: 0, brick: false })
    const days = assignWeekDays(sessions, { restDay: 0, longRunDay: 6, renfoStrategy: 'easy-day', race: false })
    expect(days[6]!.some((s) => s.category === 'long')).toBe(true)
  })

  it('never drops a session: every input session ends up placed exactly once', () => {
    const sessions = typicalWeekSessions({ efCount: 3, bikeHard: 1, bikeEasy: 1, brick: true })
    const days = assignWeekDays(sessions, { restDay: 0, longRunDay: 6, renfoStrategy: 'easy-day', race: false })
    const placed = days.flat()
    expect(placed).toHaveLength(sessions.length)
  })
})

describe('assignWeekDays — golden invariant: no hard session the eve of the long run', () => {
  const scenarios: { restDay: DayIndex; longRunDay: DayIndex }[] = [
    { restDay: 0, longRunDay: 6 }, // prototype default: Monday rest, Sunday long
    { restDay: 3, longRunDay: 0 },
    { restDay: 1, longRunDay: 2 }, // long run day adjacent to rest day
    { restDay: 5, longRunDay: 4 },
    { restDay: 0, longRunDay: 0 }, // same day chosen for both — scheduler must shift the long run
  ]

  for (const { restDay, longRunDay } of scenarios) {
    it(`holds for restDay=${restDay}, longRunDay=${longRunDay}`, () => {
      // 3 hard sessions (2 quality + 1 bike hard) is the realistic max per week.
      const sessions: Session[] = [
        longRunSession({ goal: 21, phase: 'spe', recovery: false, longRunKm: 16, vma: 14, racePct: 0.85 }).session,
        qualitySession({ phase: 'spe', recovery: false, taperIndex: null, taperWeeks: 2, vma: 14, racePct: 0.85, runSessionsPerWeek: 5 }).primary,
        qualitySession({ phase: 'spe', recovery: false, taperIndex: null, taperWeeks: 2, vma: 14, racePct: 0.85, runSessionsPerWeek: 5 }).secondary!,
        bikeHardSession(),
        efSession(14),
        renfoSession('spe'),
      ]
      const days = assignWeekDays(sessions, { restDay, longRunDay, renfoStrategy: 'easy-day', race: false })
      const effectiveLongDay = days.findIndex((d) => d.some((s) => s.category === 'long'))
      const eveOfLong = ((effectiveLongDay + 6) % 7) as DayIndex
      const eveHasHardSession = days[eveOfLong]!.some((s) => s.category === 'quality' || (s.category === 'bike' && s.hard))
      expect(eveHasHardSession).toBe(false)
    })
  }
})

describe('assignWeekDays — renfo strategies', () => {
  const baseSessions = () => [
    longRunSession({ goal: 21, phase: 'spe', recovery: false, longRunKm: 16, vma: 14, racePct: 0.85 }).session,
    qualitySession({ phase: 'spe', recovery: false, taperIndex: null, taperWeeks: 2, vma: 14, racePct: 0.85, runSessionsPerWeek: 4 }).primary,
    efSession(14),
    renfoSession('spe'),
  ]

  function dayWithRenfo(strategy: RenfoStrategy) {
    const days = assignWeekDays(baseSessions(), { restDay: 0, longRunDay: 6, renfoStrategy: strategy, race: false })
    return days.findIndex((d) => d.some((s) => s.category === 'renfo'))
  }

  it('easy-day: renfo lands alongside the footing (or alone if no easy day was free)', () => {
    const days = assignWeekDays(baseSessions(), { restDay: 0, longRunDay: 6, renfoStrategy: 'easy-day', race: false })
    const renfoDay = days.find((d) => d.some((s) => s.category === 'renfo'))!
    const hasEfOnSameDay = renfoDay.some((s) => s.category === 'ef')
    expect(hasEfOnSameDay).toBe(true)
  })

  it('quality-day: renfo is paired on the same day as the quality session', () => {
    const days = assignWeekDays(baseSessions(), { restDay: 0, longRunDay: 6, renfoStrategy: 'quality-day', race: false })
    const renfoDay = days.find((d) => d.some((s) => s.category === 'renfo'))!
    expect(renfoDay.some((s) => s.category === 'quality')).toBe(true)
  })

  it('dedicated-day: renfo gets its own day with no other session, when one is free', () => {
    const days = assignWeekDays(baseSessions(), { restDay: 0, longRunDay: 6, renfoStrategy: 'dedicated-day', race: false })
    const renfoDay = days.find((d) => d.some((s) => s.category === 'renfo'))!
    expect(renfoDay).toHaveLength(1)
  })

  it('all three strategies place renfo on a different (valid, non-rest) day', () => {
    for (const strategy of ['easy-day', 'quality-day', 'dedicated-day'] as RenfoStrategy[]) {
      const dayIndex = dayWithRenfo(strategy)
      expect(dayIndex).not.toBe(-1)
      expect(dayIndex).not.toBe(0) // not the rest day
    }
  })
})

describe('assignWeekDays — overflow', () => {
  it('doubles up overflow sessions on an all-easy day rather than dropping them', () => {
    // 6 run sessions/week + lots of footings: more items than free non-rest, non-long days.
    const sessions = typicalWeekSessions({ efCount: 5, bikeHard: 0, bikeEasy: 0, brick: false })
    const days = assignWeekDays(sessions, { restDay: 0, longRunDay: 6, renfoStrategy: 'easy-day', race: false })
    expect(days.flat()).toHaveLength(sessions.length)
    const doubledDay = days.find((d) => d.length >= 2 && d.every((s) => s.category === 'ef' || s.category === 'renfo'))
    expect(doubledDay).toBeDefined()
  })
})

describe('assignWeekDays — race week', () => {
  it('places only the race session (on the long-run day) and the déblocage footing (2 days before)', () => {
    const goalName = 'Semi'
    const kmPace = '4:52'
    const sessions: Session[] = [deblocageSession(), raceDaySession(goalName, kmPace), raceRenfoSession()]
    const days = assignWeekDays(sessions, { restDay: 0, longRunDay: 6, renfoStrategy: 'easy-day', race: true })

    expect(days[6]).toHaveLength(1)
    expect(days[6]![0]!.category).toBe('race')
    expect(days[(6 + 5) % 7]).toHaveLength(1) // Friday: 2 days before Sunday
    expect(days[(6 + 5) % 7]![0]!.category).toBe('ef')

    // The race-week renfo ("mobilité douce") is intentionally not placed on the calendar.
    expect(days.flat().some((s) => s.category === 'renfo')).toBe(false)
  })
})
