import { describe, expect, it } from 'vitest'
import {
  bikeEasySession,
  bikeHardSession,
  brickSession,
  longRunSession,
  qualitySession,
  raceDaySession,
  raceRenfoSession,
  renfoSession,
} from '../../src/lib/sessionCatalog'
import { paceLabel } from '../../src/lib/formulas'

function flatten(detail: { text: string }[]): string {
  return detail.map((s) => s.text).join('')
}

describe('renfoSession — phased content', () => {
  it('is 30min force générale in reprise and fondation', () => {
    expect(renfoSession('rep').title).toBe('Renfo — force générale (30 min)')
    expect(renfoSession('fond').title).toBe('Renfo — force générale (30 min)')
  })

  it('is 30min prévention & pliométrie in spécifique', () => {
    expect(renfoSession('spe').title).toBe('Renfo — prévention & pliométrie (30 min)')
  })

  it('is 15-20min mobilité only in affûtage', () => {
    expect(renfoSession('tap').title).toBe('Renfo léger — gainage & mobilité (15–20 min)')
  })

  it('race week drops renfo to a mobility-only note', () => {
    const s = raceRenfoSession()
    expect(s.title).toBe('Mobilité douce seulement')
    expect(flatten(s.detail)).toContain('Pas de renfo')
  })
})

describe('brickSession', () => {
  it('is more specific (closer to race effort) in spécifique than fondation', () => {
    expect(flatten(brickSession('spe').detail)).toContain('allure objectif')
    expect(flatten(brickSession('fond').detail)).toContain('allure footing')
  })
})

describe('qualitySession', () => {
  const base = { taperIndex: null, taperWeeks: 2, vma: 14, racePct: 0.85, runSessionsPerWeek: 4 }

  it('is VMA in fondation and Seuil in spécifique', () => {
    expect(qualitySession({ ...base, phase: 'fond', recovery: false }).primary.title).toBe('VMA')
    expect(qualitySession({ ...base, phase: 'spe', recovery: false }).primary.title).toBe('Seuil')
  })

  it('adds a 2nd "VMA d\'entretien" session only in spécifique, non-recovery, with 5+ sessions/week', () => {
    expect(qualitySession({ ...base, phase: 'spe', recovery: false, runSessionsPerWeek: 5 }).secondary).toBeDefined()
    expect(qualitySession({ ...base, phase: 'spe', recovery: false, runSessionsPerWeek: 4 }).secondary).toBeUndefined()
    expect(qualitySession({ ...base, phase: 'spe', recovery: true, runSessionsPerWeek: 5 }).secondary).toBeUndefined()
    expect(qualitySession({ ...base, phase: 'fond', recovery: false, runSessionsPerWeek: 5 }).secondary).toBeUndefined()
  })

  it('taper title stays "Rappels d\'allure" even on the last (déblocage) taper week', () => {
    const lastWeek = qualitySession({ ...base, phase: 'tap', recovery: false, taperIndex: 2, taperWeeks: 2 })
    expect(lastWeek.primary.title).toBe("Rappels d'allure")
    expect(flatten(lastWeek.primary.detail)).toContain('Déblocage')

    const midWeek = qualitySession({ ...base, phase: 'tap', recovery: false, taperIndex: 1, taperWeeks: 2 })
    expect(midWeek.primary.title).toBe("Rappels d'allure")
    expect(flatten(midWeek.primary.detail)).toContain("Rappels d'allure")
  })
})

describe('longRunSession', () => {
  it('is a plain easy long run outside spécifique, or during a spécifique recovery week', () => {
    const easy = longRunSession({ goal: 21, phase: 'fond', recovery: false, longRunKm: 14, vma: 14, racePct: 0.85 })
    expect(easy.mixed).toBeUndefined()
    expect(easy.session.title).toBe('Sortie longue (14 km)')

    const specificRecovery = longRunSession({ goal: 21, phase: 'spe', recovery: true, longRunKm: 15, vma: 14, racePct: 0.85 })
    expect(specificRecovery.mixed).toBeUndefined()
    expect(specificRecovery.session.title).toBe('Sortie longue (15 km)')
  })

  it('switches to the mixed long run in spécifique, outside recovery weeks', () => {
    const mixed = longRunSession({ goal: 21, phase: 'spe', recovery: false, longRunKm: 19, vma: 14, racePct: 0.85 })
    expect(mixed.mixed).toBeDefined()
    expect(mixed.session.title).toBe('Sortie longue mixte')
  })
})

describe('bike sessions', () => {
  it('flags PMA/seuil as hard and endurance as not', () => {
    expect(bikeHardSession().hard).toBe(true)
    expect(bikeEasySession().hard).toBe(false)
  })

  it('never mentions watts or FTP (durée + ressenti only)', () => {
    expect(flatten(bikeHardSession().detail).toLowerCase()).not.toMatch(/watt|ftp/)
    expect(flatten(bikeEasySession().detail).toLowerCase()).not.toMatch(/watt|ftp/)
  })
})

describe('raceDaySession', () => {
  it('embeds the goal name and target pace', () => {
    const kmPace = paceLabel(14, 0.85)
    const session = raceDaySession('Semi', kmPace)
    expect(session.title).toBe('Jour J — Semi')
    expect(flatten(session.detail)).toContain(`${kmPace}/km`)
  })
})
