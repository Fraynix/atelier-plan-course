import {
  MIXED_LONG_RUN,
  MIXED_LONG_RUN_FLOAT_OFFSET,
  MIXED_LONG_RUN_MIN_FLOAT_PCT,
  MIXED_LONG_RUN_MIN_REPS,
} from './config'
import { paceLabel } from './formulas'
import type { DetailSegment, Goal } from './types'

export interface MixedLongRun {
  totalKm: number
  warmupKm: number
  cooldownKm: number
  reps: number
  workKm: number
  floatKm: number
  workPaceLabel: string
  floatPaceLabel: string
  detail: DetailSegment[]
}

/**
 * The "sortie longue mixte" — continuous, no stopping: a warm-up, N reps
 * alternating race-pace work blocks with a slightly-slower "float" active
 * recovery, and a cool-down. Used in the spécifique phase (non-recovery
 * weeks) in place of a plain easy long run.
 *
 * `n` is derived from how much distance is left after warm-up/cool-down
 * (floor), which is why the resulting total can land a little under the raw
 * long-run target — e.g. a semi's 19km peak target yields a 17km mixed long
 * run, in the same "~18km at peak" ballpark called out in the spec.
 */
export function computeMixedLongRun(goal: Goal, targetKm: number, vma: number, racePct: number): MixedLongRun {
  const cfg = MIXED_LONG_RUN[goal]
  const floatPct = Math.max(MIXED_LONG_RUN_MIN_FLOAT_PCT, racePct - MIXED_LONG_RUN_FLOAT_OFFSET)
  const available = targetKm - cfg.warmup - cfg.cooldown
  const repLength = cfg.work + cfg.float
  const reps = Math.max(MIXED_LONG_RUN_MIN_REPS, Math.floor(available / repLength))
  const totalKm = cfg.warmup + cfg.cooldown + reps * repLength

  const workPaceLabel = paceLabel(vma, racePct)
  const floatPaceLabel = paceLabel(vma, floatPct)

  const detail: DetailSegment[] = [
    { text: `${totalKm} km — sortie longue mixte`, strong: true },
    { text: ' (en continu, sans arrêt) : ' },
    { text: `${cfg.warmup} km EF (échauffement) + ` },
    { text: `${reps} × [${cfg.work} km à ${workPaceLabel} `, strong: true },
    { text: 'allure objectif', strong: true, muted: true },
    { text: ` / ${cfg.float} km à ${floatPaceLabel} `, strong: true },
    { text: 'récup active', strong: true, muted: true },
    { text: ']', strong: true },
    { text: ` + ${cfg.cooldown} km EF (retour au calme)` },
  ]

  return {
    totalKm,
    warmupKm: cfg.warmup,
    cooldownKm: cfg.cooldown,
    reps,
    workKm: cfg.work,
    floatKm: cfg.float,
    workPaceLabel,
    floatPaceLabel,
    detail,
  }
}
