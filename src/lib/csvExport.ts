import type { Plan } from './types'

function csvEscape(value: string): string {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function detailToText(detail: { text: string }[]): string {
  return detail
    .map((s) => s.text)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Builds a CSV (one row per session) of the whole plan, ready to download. */
export function planToCsv(plan: Plan): string {
  const header = ['Semaine', 'Phase', 'Catégorie', 'Titre', 'Détail']
  const rows: string[][] = [header]

  for (const week of plan.weeks) {
    for (const session of week.sessions) {
      rows.push([
        `S${week.week}`,
        week.phaseLabel + (week.recovery ? ' (assimilation)' : '') + (week.race ? ' (course)' : ''),
        session.category,
        session.title,
        detailToText(session.detail),
      ])
    }
  }

  return rows.map((row) => row.map(csvEscape).join(';')).join('\n')
}
