import type { DayIndex, RenfoStrategy, Session, WeekSchedule } from './types'

/**
 * Places sessions onto a Mon(0)→Sun(6) week grid.
 *
 * Rules (ported 1:1 from the reference prototype's `assignDays`):
 * - The long run and the rest day are placed first, on their chosen days.
 * - "Hard" sessions (quality runs, and bike PMA/seuil) are spread across a
 *   preference order that keeps them ≥48h apart and never the day right
 *   before a long run or another hard session.
 * - Brick sessions get their own, looser preference order.
 * - Easy sessions (footings, bike endurance) fill whatever's left.
 * - Renfo is paired according to `renfoStrategy` (see below) — the only
 *   behavior not hardcoded in the prototype, which always used "easy-day".
 * - Overflow (more sessions than free days) doubles up on an all-easy day
 *   when one exists; as a last resort (should be rare) it lands on any
 *   non-rest day rather than being silently dropped.
 */
export function assignWeekDays(
  sessions: Session[],
  opts: { restDay: DayIndex; longRunDay: DayIndex; renfoStrategy: RenfoStrategy; race: boolean },
): WeekSchedule {
  const days: Session[][] = [[], [], [], [], [], [], []]
  const { restDay, race } = opts
  let longRunDay = opts.longRunDay

  if (race) {
    const raceSession = sessions.find((s) => s.category === 'race') ?? sessions[0]
    if (raceSession) days[longRunDay]!.push(raceSession)
    const deblocage = sessions.find((s) => s.category === 'ef')
    if (deblocage) days[(longRunDay + 5) % 7]!.push(deblocage)
    // Note: a race week's renfo ("mobilité douce") is intentionally not placed
    // on the calendar, matching the prototype — it only appears in the table row.
    return days
  }

  const used = new Array<boolean>(7).fill(false)
  used[restDay] = true
  if (longRunDay === restDay) longRunDay = ((restDay + 1) % 7) as DayIndex

  const byCategory = (category: Session['category'], hard?: boolean) =>
    sessions.filter((s) => s.category === category && (hard === undefined || Boolean(s.hard) === hard))

  const overflow: Session[] = []

  const long = byCategory('long')[0]
  if (long) {
    days[longRunDay]!.push(long)
    used[longRunDay] = true
  }

  // Hard days (quality + bike PMA/seuil): prefer days far from the long run,
  // only reaching its immediate neighbors (and the long-run day itself) as a
  // last resort. This is the same relative shape as the prototype's fixed
  // [1,3,2,4,0,5,6] order (which was tuned specifically for longRunDay=Sunday)
  // generalized so it still protects the "never the eve of the long run" rule
  // when the user picks a different long-run day.
  const hardPref = hardDayPreference(longRunDay)
  byCategory('quality').forEach((q) => placeFirstFree(days, used, hardPref, q))
  byCategory('bike', true).forEach((b) => placeFirstFree(days, used, hardPref, b))

  const brick = byCategory('brick')[0]
  if (brick) placeFirstFree(days, used, [5, 2, 4, 3, 1], brick)

  const fillPref = [2, 4, 5, 1, 3, 0, 6] as const
  byCategory('bike', false).forEach((b) => {
    if (!placeFirstFree(days, used, fillPref, b)) overflow.push(b)
  })
  byCategory('ef').forEach((ef) => {
    if (!placeFirstFree(days, used, fillPref, ef)) overflow.push(ef)
  })

  const renfo = byCategory('renfo')[0]
  if (renfo) {
    const placed = placeRenfo(days, used, renfo, opts.renfoStrategy, restDay)
    if (!placed) overflow.push(renfo)
  }

  // Débordement: double up on a day that's entirely easy sessions; failing
  // that (should be rare), any non-rest day rather than dropping the session.
  overflow.forEach((session) => {
    for (let d = 0; d < 7; d++) {
      if (d !== restDay && days[d]!.length > 0 && days[d]!.every((s) => isEasy(s))) {
        days[d]!.push(session)
        return
      }
    }
    for (let d = 0; d < 7; d++) {
      if (d !== restDay) {
        days[d]!.push(session)
        return
      }
    }
  })

  return days
}

/**
 * Day preference for "hard" sessions, expressed as offsets from the long-run
 * day: prefer the days furthest from it (offsets 2–5), only reaching its
 * immediate neighbors (offsets 1 and 6) or itself (offset 0) as a last
 * resort. `used[longRunDay]` is already true by the time this is consulted,
 * so offset 0 never actually wins a slot.
 */
function hardDayPreference(longRunDay: number): number[] {
  const relativeOffsets = [2, 4, 3, 5, 1, 6, 0]
  return relativeOffsets.map((offset) => (longRunDay + offset) % 7)
}

function isEasy(s: Session): boolean {
  return s.category === 'ef' || (s.category === 'bike' && !s.hard) || s.category === 'renfo'
}

function placeFirstFree(days: Session[][], used: boolean[], pref: readonly number[], item: Session): boolean {
  for (const d of pref) {
    if (!used[d]) {
      days[d]!.push(item)
      used[d] = true
      return true
    }
  }
  for (let d = 0; d < 7; d++) {
    if (!used[d]) {
      days[d]!.push(item)
      used[d] = true
      return true
    }
  }
  return false
}

function placeRenfo(
  days: Session[][],
  used: boolean[],
  renfo: Session,
  strategy: RenfoStrategy,
  restDay: number,
): boolean {
  if (strategy === 'dedicated-day') {
    for (let d = 0; d < 7; d++) {
      if (!used[d]) {
        days[d]!.push(renfo)
        used[d] = true
        return true
      }
    }
    // No free day left: fall through to pairing with an easy day instead of losing the session.
  }

  if (strategy === 'quality-day') {
    for (let d = 0; d < 7; d++) {
      if (d !== restDay && days[d]!.some((s) => s.category === 'quality' || (s.category === 'bike' && s.hard))) {
        days[d]!.push(renfo)
        return true
      }
    }
    return placeFirstFree(days, used, [3, 2, 4, 1, 5, 0, 6], renfo)
  }

  // Default: 'easy-day' — pair with a day that currently holds exactly one easy session.
  for (let d = 0; d < 7; d++) {
    const day = days[d]!
    if (d !== restDay && day.length === 1 && (day[0]!.category === 'ef' || (day[0]!.category === 'bike' && !day[0]!.hard))) {
      day.push(renfo)
      return true
    }
  }
  return placeFirstFree(days, used, [3, 2, 4, 1, 5, 0, 6], renfo)
}
