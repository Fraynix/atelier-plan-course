import { describe, expect, it } from 'vitest'
import { DAILY_STATE_OPTIONS, getAdjustmentAdvice } from '../../src/lib/adjustmentGuide'
import type { DailyState, SessionCategory } from '../../src/lib/types'

const ALL_CATEGORIES: SessionCategory[] = ['long', 'quality', 'ef', 'renfo', 'brick', 'bike', 'race']
const ALL_STATES: DailyState[] = ['fresh', 'tired', 'very_tired', 'niggle', 'pain']

describe('DAILY_STATE_OPTIONS', () => {
  it('has one option per DailyState, each with a label and description', () => {
    expect(DAILY_STATE_OPTIONS).toHaveLength(5)
    for (const opt of DAILY_STATE_OPTIONS) {
      expect(opt.label).toBeTruthy()
      expect(opt.description).toBeTruthy()
    }
  })
})

describe('getAdjustmentAdvice', () => {
  it('never suggests skipping or downgrading when feeling fresh', () => {
    for (const category of ALL_CATEGORIES) {
      const advice = getAdjustmentAdvice('fresh', category)
      expect(advice.level).toBe('proceed')
      expect(advice.swap).toBeUndefined()
    }
  })

  it('always escalates to seek_care for pain, regardless of the planned session', () => {
    for (const category of ALL_CATEGORIES) {
      const advice = getAdjustmentAdvice('pain', category)
      expect(advice.level).toBe('seek_care')
      expect(advice.advice).toMatch(/professionnel/)
      expect(advice.swap).toBeTruthy()
    }
  })

  it('recommends full rest when very tired, never just a lighter version of the hard session', () => {
    for (const category of ALL_CATEGORIES) {
      const advice = getAdjustmentAdvice('very_tired', category)
      expect(advice.level).toBe('rest')
      expect(advice.swap).toBeTruthy()
    }
  })

  it('gives a category-specific swap for "tired" and "niggle" (reduce, not rest or proceed)', () => {
    for (const category of ALL_CATEGORIES) {
      const tired = getAdjustmentAdvice('tired', category)
      const niggle = getAdjustmentAdvice('niggle', category)
      expect(tired.level).toBe('reduce')
      expect(niggle.level).toBe('reduce')
      expect(tired.swap).toBeTruthy()
      expect(niggle.swap).toBeTruthy()
      // Different framing for fatigue vs. a physical niggle, even at the same level.
      expect(tired.swap).not.toBe(niggle.swap)
    }
  })

  it('never returns an empty headline or advice string for any state/category combination', () => {
    for (const state of ALL_STATES) {
      for (const category of ALL_CATEGORIES) {
        const advice = getAdjustmentAdvice(state, category)
        expect(advice.headline.length).toBeGreaterThan(0)
        expect(advice.advice.length).toBeGreaterThan(0)
      }
    }
  })
})
