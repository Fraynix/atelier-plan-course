import { PCT_VMA, SECOND_QUALITY_MIN_SESSIONS } from './config'
import { paceLabel } from './formulas'
import { computeMixedLongRun, type MixedLongRun } from './mixedLongRun'
import type { DetailSegment, Goal, Phase, Session } from './types'

const text = (t: string): DetailSegment => ({ text: t })

// ---------------------------------------------------------------------------
// Renfo (strength) — phased: force générale → prévention/pliométrie → mobilité
// ---------------------------------------------------------------------------

/** Renfo session content for a normal (non-race) week, phased by training phase. */
export function renfoSession(phase: Phase): Session {
  if (phase === 'tap') {
    return {
      category: 'renfo',
      title: 'Renfo léger — gainage & mobilité (15–20 min)',
      detail: [
        text('Gainage court + mobilité hanches/chevilles. On entretient, '),
        { text: 'zéro fatigue', strong: true },
        text(' avant la course.'),
      ],
    }
  }
  if (phase === 'spe') {
    return {
      category: 'renfo',
      title: 'Renfo — prévention & pliométrie (30 min)',
      detail: [
        text(
          'Gainage + pliométrie légère (skippings, petits sauts) + proprioception cheville/hanche + excentrique mollets. Spécifique, sans courbatures avant les séances clés.',
        ),
      ],
    }
  }
  return {
    category: 'renfo',
    title: 'Renfo — force générale (30 min)',
    detail: [
      text('Gainage (planche, latéral) + squats/fentes + chaîne postérieure (ischios, fessiers). Charge modérée. '),
      { text: 'Le socle anti-blessure.', strong: true },
    ],
  }
}

/** Race-week renfo: skipped entirely, mobility-only note. */
export function raceRenfoSession(): Session {
  return {
    category: 'renfo',
    title: 'Mobilité douce seulement',
    detail: [text('Pas de renfo cette semaine — on préserve la fraîcheur.')],
  }
}

// ---------------------------------------------------------------------------
// Brick (vélo → course)
// ---------------------------------------------------------------------------

/** Only ever called for phase 'fond' or 'spe' (the only phases that get a brick). */
export function brickSession(phase: Extract<Phase, 'fond' | 'spe'>): Session {
  if (phase === 'spe') {
    return {
      category: 'brick',
      title: 'Enchaînement vélo → course (brique)',
      detail: [
        text('50–70 min vélo (quelques accélérations) → 20–25 min course, dont ~10 min à allure objectif. Spécifique triathlon.'),
      ],
    }
  }
  return {
    category: 'brick',
    title: 'Enchaînement vélo → course (brique)',
    detail: [text('45–60 min vélo easy → 15–20 min course à allure footing. Habitue les jambes à courir « après ».')],
  }
}

// ---------------------------------------------------------------------------
// Bike (durée + ressenti — jamais de watts/FTP)
// ---------------------------------------------------------------------------

export function bikeHardSession(): Session {
  return {
    category: 'bike',
    hard: true,
    title: 'Vélo — PMA / seuil',
    detail: [
      text('~1 h : 20 min échauffement + 5–6 × 3 min en force soutenue (ressenti 8/10, souffle court, récup 2–3 min) + retour au calme.'),
    ],
  }
}

export function bikeEasySession(): Session {
  return {
    category: 'bike',
    hard: false,
    title: 'Vélo — endurance',
    detail: [text('1 h–1 h 30 à allure facile (Z2, tu peux parler). Volume aérobie sans impact articulaire.')],
  }
}

// ---------------------------------------------------------------------------
// Footings
// ---------------------------------------------------------------------------

export function efSession(vma: number): Session {
  const pace = paceLabel(vma, PCT_VMA.ef)
  return {
    category: 'ef',
    title: 'Footing facile',
    detail: [text(`30–50 min en endurance (${pace}/km), en aisance respiratoire.`)],
  }
}

export function deblocageSession(): Session {
  return {
    category: 'ef',
    title: 'Footing de déblocage (2–3 j avant)',
    detail: [text('20 min très facile + 3 × 30 s à allure course. Jambes fraîches.')],
  }
}

// ---------------------------------------------------------------------------
// Race day
// ---------------------------------------------------------------------------

export function raceDaySession(goalName: string, kmPaceLabel: string): Session {
  return {
    category: 'race',
    title: `Jour J — ${goalName}`,
    detail: [
      text('Objectif '),
      { text: `${kmPaceLabel}/km`, strong: true },
      text('. Pars contrôlée, finis plus vite. Bonne course !'),
    ],
  }
}

// ---------------------------------------------------------------------------
// Quality (VMA in fondation, seuil in spécifique, lignes droites/rappels
// d'allure outside the build block)
// ---------------------------------------------------------------------------

export interface QualityInput {
  phase: Phase
  recovery: boolean
  /** 1-based index within the taper block; required when phase is 'tap'. */
  taperIndex: number | null
  taperWeeks: number
  vma: number
  racePct: number
  /** Running sessions/week — a 5th+ session unlocks a 2nd ("entretien") quality session in spécifique. */
  runSessionsPerWeek: number
}

export interface QualityResult {
  primary: Session
  /** "VMA d'entretien" — present only in a non-recovery spécifique week with 5+ run sessions. */
  secondary?: Session
}

export function qualitySession(input: QualityInput): QualityResult {
  const { phase, recovery, vma, racePct } = input

  if (phase === 'rep') {
    return {
      primary: {
        category: 'quality',
        title: 'Lignes droites',
        detail: [text('Lignes droites : 6 × 100 m rapides en fin de footing')],
      },
    }
  }

  if (phase === 'tap') {
    const taperIndex = input.taperIndex ?? 1
    const isLastTaperWeek = taperIndex === input.taperWeeks
    const detail = isLastTaperWeek
      ? "Déblocage : 15 min très facile + 3 × 30 s allure course"
      : `Rappels d'allure : 20 min facile + 5 × 1 min à ${paceLabel(vma, racePct)}/km`
    return {
      // Title stays "Rappels d'allure" even on the déblocage week — ported as-is from the prototype.
      primary: { category: 'quality', title: "Rappels d'allure", detail: [text(detail)] },
    }
  }

  if (phase === 'fond') {
    const vmaShortLabel = paceLabel(vma, PCT_VMA.vmaShort)
    const vmaLabel = paceLabel(vma, PCT_VMA.vma)
    const detail = recovery
      ? `20 min échauffement + 8 × 30/30 (30 s vite / 30 s footing) à ${vmaShortLabel}/km + 10 min retour au calme`
      : `20 min échauffement + 2 × (6 × 30/30) à ${vmaShortLabel}/km, récup 3 min footing entre les 2 blocs — ou 6 × 400 m à ${vmaLabel}/km, récup 1 min + 10 min retour au calme`
    return { primary: { category: 'quality', title: 'VMA', detail: [text(detail)] } }
  }

  // spe
  const seuilLabel = paceLabel(vma, PCT_VMA.seuil)
  const detail = recovery
    ? `15 min échauffement + 2 × 8 min à ${seuilLabel}/km, récup 2 min footing lent entre les blocs + 10 min retour au calme`
    : `20 min échauffement + 3 × 8 min à ${seuilLabel}/km, récup 2 min footing lent entre les blocs + 10 min retour au calme`
  const primary: Session = { category: 'quality', title: 'Seuil', detail: [text(detail)] }

  if (!recovery && input.runSessionsPerWeek >= SECOND_QUALITY_MIN_SESSIONS) {
    const vmaLabel = paceLabel(vma, PCT_VMA.vma)
    const secondary: Session = {
      category: 'quality',
      title: "VMA d'entretien",
      detail: [text(`VMA d'entretien : 5 × 300 m à ${vmaLabel}/km`)],
    }
    return { primary, secondary }
  }

  return { primary }
}

// ---------------------------------------------------------------------------
// Long run (easy, or mixed in spécifique outside recovery weeks)
// ---------------------------------------------------------------------------

export interface LongRunInput {
  goal: Goal
  phase: Phase
  recovery: boolean
  longRunKm: number
  vma: number
  racePct: number
}

export interface LongRunResult {
  session: Session
  mixed?: MixedLongRun
}

export function longRunSession(input: LongRunInput): LongRunResult {
  const { phase, recovery, longRunKm, vma, racePct, goal } = input

  if (phase === 'spe' && !recovery) {
    const mixed = computeMixedLongRun(goal, longRunKm, vma, racePct)
    return {
      session: { category: 'long', title: 'Sortie longue mixte', detail: mixed.detail },
      mixed,
    }
  }

  const easyPace = paceLabel(vma, PCT_VMA.longRunEasy)
  return {
    session: {
      category: 'long',
      title: `Sortie longue (${longRunKm} km)`,
      detail: [{ text: `${longRunKm} km`, strong: true }, text(` en endurance facile (${easyPace}/km)`)],
    },
  }
}
