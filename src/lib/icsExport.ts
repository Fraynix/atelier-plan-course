import { assignWeekDays } from './scheduler'
import type { Plan } from './types'

/** The Monday on/after `from` (today counts if it's already Monday). Day 0=Monday..6=Sunday. */
export function nextMonday(from: Date): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const isoDay = (d.getDay() + 6) % 7 // JS getDay(): Sun=0..Sat=6 -> Mon=0..Sun=6
  d.setDate(d.getDate() - isoDay + (isoDay === 0 ? 0 : 7))
  return d
}

function formatIcsDate(d: Date): string {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${y}${m}${day}`
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + days)
  return result
}

function detailToText(detail: { text: string }[]): string {
  return detail
    .map((s) => s.text)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

const CATEGORY_LABEL: Record<string, string> = {
  long: 'Sortie longue',
  quality: 'Qualité',
  ef: 'Footing',
  renfo: 'Renfo',
  brick: 'Brique',
  bike: 'Vélo',
  race: 'Course',
}

/**
 * Exports the plan as a downloadable .ics calendar: one all-day event per
 * session, placed on its scheduled weekday (Mon=0..Sun=6) starting from the
 * Monday of `startDate`'s week (defaults to the next upcoming Monday).
 */
export function planToIcs(plan: Plan, startDate: Date = nextMonday(new Date())): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Atelier plan de course//FR',
    'CALSCALE:GREGORIAN',
  ]

  plan.weeks.forEach((week, weekIndex) => {
    const weekMonday = addDays(startDate, weekIndex * 7)
    const days = assignWeekDays(week.sessions, {
      restDay: plan.meta.restDay,
      longRunDay: plan.meta.longRunDay,
      renfoStrategy: plan.meta.renfoStrategy,
      race: week.race,
    })

    days.forEach((sessions, dayIndex) => {
      const date = addDays(weekMonday, dayIndex)
      const dtstart = formatIcsDate(date)
      const dtend = formatIcsDate(addDays(date, 1))

      sessions.forEach((session, i) => {
        const label = CATEGORY_LABEL[session.category] ?? session.category
        lines.push(
          'BEGIN:VEVENT',
          `UID:s${week.week}-${dayIndex}-${i}@atelier-plan-course`,
          `DTSTAMP:${dtstart}T000000Z`,
          `DTSTART;VALUE=DATE:${dtstart}`,
          `DTEND;VALUE=DATE:${dtend}`,
          `SUMMARY:${escapeIcsText(`${label} — ${session.title}`)}`,
          `DESCRIPTION:${escapeIcsText(`Semaine ${week.week} (${week.phaseLabel}) — ${detailToText(session.detail)}`)}`,
          'END:VEVENT',
        )
      })
    })
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
