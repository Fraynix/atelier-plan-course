import { describe, expect, it } from 'vitest'
import { planToCsv } from '../../src/lib/csvExport'
import { generatePlan } from '../../src/lib/planGenerator'
import { DEFAULT_SETTINGS } from '../../src/lib/types'

describe('planToCsv', () => {
  it('has a header row plus one row per session across the whole plan', () => {
    const plan = generatePlan(DEFAULT_SETTINGS)
    const csv = planToCsv(plan)
    const lines = csv.split('\n')
    const totalSessions = plan.weeks.reduce((sum, w) => sum + w.sessions.length, 0)
    expect(lines).toHaveLength(totalSessions + 1)
    expect(lines[0]).toBe('Semaine;Phase;Catégorie;Titre;Détail')
  })

  it('quotes fields containing the delimiter', () => {
    const plan = generatePlan(DEFAULT_SETTINGS)
    const csv = planToCsv(plan)
    // Quality session details contain commas ("récup 2 min ... + 10 min retour au calme")
    expect(csv).toMatch(/"[^"]*[,;][^"]*"/)
  })
})
