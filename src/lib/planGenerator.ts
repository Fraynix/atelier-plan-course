import { GOAL_NAME, RACE_PACE_PCT } from './config'
import { paceLabel } from './formulas'
import { longRunKmForWeek } from './longRun'
import { computePhasePlan } from './periodization'
import {
  bikeEasySession,
  bikeHardSession,
  brickSession,
  deblocageSession,
  efSession,
  longRunSession,
  qualitySession,
  raceDaySession,
  raceRenfoSession,
  renfoSession,
} from './sessionCatalog'
import { computeRunHours, computeWeekVolumeKm, computeWeeklyRunKm } from './weeklyVolume'
import type { DetailSegment, Phase, Session, UserSettings, WeekPlan, Plan } from './types'

function buildOthersCell(sessions: Session[], phase: Phase, race: boolean): string[] {
  const efCount = sessions.filter((s) => s.category === 'ef').length
  const bikeCount = sessions.filter((s) => s.category === 'bike').length
  const hasBrick = sessions.some((s) => s.category === 'brick')

  const others: string[] = []
  if (efCount > 0) others.push(`${efCount} × footing facile`)
  if (bikeCount > 0) others.push(`${bikeCount} × vélo`)
  if (hasBrick) others.push('1 × enchaînement (brique)')
  if (!race) others.push(`1 × renfo ${phase === 'tap' ? 'léger' : '30 min'}`)
  if (others.length === 0) others.push('repos')
  return others
}

/**
 * Assembles a full training plan from user settings: retro-plans the phases,
 * derives the long run and weekly volume, builds every session, and
 * pre-renders the weekly-table summary cells. This is the single entry
 * point tying together periodization + longRun + mixedLongRun +
 * weeklyVolume + sessionCatalog — each of which stays independently
 * testable.
 */
export function generatePlan(settings: UserSettings): Plan {
  const {
    goal,
    vma,
    weeksBeforeRace,
    hoursPerWeek,
    runSessionsPerWeek,
    bikeSessionsPerWeek,
    level,
    includeBricksAndMixed,
    restDay,
    longRunDay,
    renfoStrategy,
  } = settings

  const racePct = RACE_PACE_PCT[goal]
  const goalName = GOAL_NAME[goal]
  const kmPaceLabel = paceLabel(vma, racePct)
  const runHours = computeRunHours(hoursPerWeek, bikeSessionsPerWeek)
  const weekKm = computeWeeklyRunKm(vma, runHours)
  const phasePlan = computePhasePlan(goal, weeksBeforeRace, level)

  const weeks: WeekPlan[] = phasePlan.weeks.map((meta) => {
    const longRunKm = longRunKmForWeek({
      goal,
      level,
      phase: meta.phase,
      recovery: meta.recovery,
      buildIndex: meta.buildIndex,
      buildTotal: phasePlan.summary.buildWeeks,
      taperIndex: meta.taperIndex,
      taperWeeks: phasePlan.summary.taperWeeks,
    })

    const volumeKm = computeWeekVolumeKm({
      weekKm,
      phase: meta.phase,
      recovery: meta.recovery,
      race: meta.race,
      taperIndex: meta.taperIndex,
    })

    let sessions: Session[]
    let longCell: DetailSegment[]
    let qualityCell: DetailSegment[]

    if (meta.race) {
      sessions = [deblocageSession(), raceDaySession(goalName, kmPaceLabel), raceRenfoSession()]
      longCell = [{ text: `COURSE — ${goalName}`, strong: true }, { text: ` à ${kmPaceLabel}/km` }]
      qualityCell = [{ text: `Objectif : ${goalName} · ${kmPaceLabel}/km` }]
    } else {
      const { primary, secondary } = qualitySession({
        phase: meta.phase,
        recovery: meta.recovery,
        taperIndex: meta.taperIndex,
        taperWeeks: phasePlan.summary.taperWeeks,
        vma,
        racePct,
        runSessionsPerWeek,
      })

      const nQ = 1 + (secondary ? 1 : 0)
      const slots = Math.max(0, runSessionsPerWeek - 1 - nQ)
      const brick = includeBricksAndMixed && (meta.phase === 'fond' || meta.phase === 'spe')
      const efCount = Math.max(0, slots - (brick ? 1 : 0))

      const nb = meta.phase === 'tap' ? Math.min(1, bikeSessionsPerWeek) : bikeSessionsPerWeek
      const hardN = !meta.recovery && (meta.phase === 'fond' || meta.phase === 'spe') && nb >= 2 ? 1 : 0

      const { session: longSession, mixed } = longRunSession({
        goal,
        phase: meta.phase,
        recovery: meta.recovery,
        longRunKm,
        vma,
        racePct,
      })

      sessions = [longSession, primary]
      if (secondary) sessions.push(secondary)
      for (let i = 0; i < efCount; i++) sessions.push(efSession(vma))
      if (brick) sessions.push(brickSession(meta.phase as 'fond' | 'spe'))
      sessions.push(renfoSession(meta.phase))
      for (let i = 0; i < hardN; i++) sessions.push(bikeHardSession())
      for (let i = 0; i < nb - hardN; i++) sessions.push(bikeEasySession())

      longCell = mixed ? mixed.detail : [{ text: `${longRunKm} km`, strong: true }, { text: ' facile' }]
      qualityCell = secondary ? [...primary.detail, { text: ' · + ' }, ...secondary.detail] : primary.detail
    }

    const othersCell = buildOthersCell(sessions, meta.phase, meta.race)

    return {
      ...meta,
      longRunKm,
      volumeKm,
      sessions,
      table: { longCell, qualityCell, othersCell },
    }
  })

  return {
    meta: {
      goal,
      goalName,
      vma,
      weeks: weeksBeforeRace,
      racePct,
      kmPaceLabel,
      weekKm,
      bikeSessionsPerWeek,
      restDay,
      longRunDay,
      renfoStrategy,
      ...phasePlan.summary,
    },
    weeks,
  }
}
