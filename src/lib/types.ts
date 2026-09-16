/**
 * Domain types for the training-plan generator.
 * This module has zero React/DOM dependency — it is the vocabulary shared
 * by every pure function in `lib/`.
 */

/** Target race distance in km. Only these four are supported by the generator. */
export type Goal = 5 | 10 | 21 | 42

/** Starting fitness level: 1 = prudent (reprise), 2 = régulier, 3 = solide. */
export type Level = 1 | 2 | 3

/** Training block phase, in chronological order. */
export type Phase = 'rep' | 'fond' | 'spe' | 'tap'

/** Category of a single session, drives badge color and scheduling rules. */
export type SessionCategory = 'long' | 'quality' | 'ef' | 'renfo' | 'brick' | 'bike' | 'race'

/** Where the weekly renfo (strength) session gets paired in the calendar. */
export type RenfoStrategy = 'easy-day' | 'quality-day' | 'dedicated-day'

/** ISO-ish day index, Monday = 0 … Sunday = 6, matching the prototype's convention. */
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** A segment of rich text within a session's description: plain, bold, or muted (or both). */
export interface DetailSegment {
  text: string
  strong?: boolean
  muted?: boolean
}

export type SessionDetail = DetailSegment[]

export interface Session {
  category: SessionCategory
  title: string
  detail: SessionDetail
  /** Marks a session as "dure" (quality run or bike PMA/seuil) for the 48h-spacing rule. */
  hard?: boolean
}

export interface UserSettings {
  goal: Goal
  /** Vitesse Maximale Aérobie, km/h. */
  vma: number
  /** Weeks of training before race day. */
  weeksBeforeRace: number
  /** Hours available per week, across running and cycling. */
  hoursPerWeek: number
  /** Running sessions per week (3–6). */
  runSessionsPerWeek: number
  /** Cycling sessions per week (0–4); each one deducts ~1h from hoursPerWeek. */
  bikeSessionsPerWeek: number
  level: Level
  /** Whether to include brick sessions (bike→run) and mixed long runs. */
  includeBricksAndMixed: boolean
  restDay: DayIndex
  longRunDay: DayIndex
  renfoStrategy: RenfoStrategy
  /** Optional heart-rate zones inputs. */
  hrMax?: number
  hrRest?: number
}

export const DEFAULT_SETTINGS: UserSettings = {
  goal: 21,
  vma: 14,
  weeksBeforeRace: 12,
  hoursPerWeek: 5,
  runSessionsPerWeek: 4,
  bikeSessionsPerWeek: 0,
  level: 2,
  includeBricksAndMixed: true,
  restDay: 0,
  longRunDay: 6,
  renfoStrategy: 'easy-day',
}

export interface PhaseSummary {
  repriseWeeks: number
  fondationWeeks: number
  specificWeeks: number
  taperWeeks: number
  buildWeeks: number
}

export interface WeekMeta {
  week: number
  phase: Phase
  phaseLabel: string
  /** Assimilation (lightened) week — every 3rd build week, never the last of the block. */
  recovery: boolean
  race: boolean
  /** 1-based index within the current build block (fondation+spécifique), for progression math. */
  buildIndex: number | null
  /** 1-based index within the taper block. */
  taperIndex: number | null
}

export interface WeekPlan extends WeekMeta {
  longRunKm: number
  volumeKm: number
  sessions: Session[]
  /** Pre-rendered summary cells for the weekly table. */
  table: {
    longCell: SessionDetail
    qualityCell: SessionDetail
    othersCell: string[]
  }
}

export interface HeartRateZone {
  label: string
  pctMin: number
  pctMax: number
  /** % of HRmax method. */
  hrPctOfMax: [number, number]
  /** Karvonen method, only present when hrRest is provided. */
  hrKarvonen?: [number, number]
}

export interface Plan {
  meta: {
    goal: Goal
    goalName: string
    vma: number
    weeks: number
    racePct: number
    kmPaceLabel: string
    weekKm: number
    bikeSessionsPerWeek: number
    restDay: DayIndex
    longRunDay: DayIndex
    renfoStrategy: RenfoStrategy
  } & PhaseSummary
  weeks: WeekPlan[]
}

export type WeekSchedule = Session[][]
