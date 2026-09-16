import { describe, expect, it } from 'vitest'
import { buildPaceMemo } from '../../src/lib/paceReferences'
import { hrKarvonen, hrPercentOfMax, paceLabel } from '../../src/lib/formulas'
import { PCT_VMA } from '../../src/lib/config'

describe('buildPaceMemo', () => {
  it('has one row per reference intensity, all with a valid pace label', () => {
    const rows = buildPaceMemo(14)
    expect(rows).toHaveLength(6)
    for (const row of rows) {
      expect(row.paceLabel).toMatch(/^\d+:\d{2}$/)
    }
  })

  it('uses the canonical 1.00 / 1.05 %VMA for VMA longue/courte (not the prototype legacy 0.98/1.03)', () => {
    const rows = buildPaceMemo(14)
    const vmaLongue = rows.find((r) => r.label === 'VMA longue')!
    const vmaCourte = rows.find((r) => r.label === 'VMA courte')!
    expect(vmaLongue.pct).toBe(1.0)
    expect(vmaCourte.pct).toBe(1.05)
    expect(vmaLongue.paceLabel).toBe(paceLabel(14, 1.0))
    expect(vmaCourte.paceLabel).toBe(paceLabel(14, 1.05))
  })

  it('recalculates live when VMA changes', () => {
    const slow = buildPaceMemo(10)
    const fast = buildPaceMemo(16)
    expect(slow[0]!.paceLabel).not.toBe(fast[0]!.paceLabel)
  })

  it('omits HR fields when hrMax is not provided', () => {
    const rows = buildPaceMemo(14)
    for (const row of rows) {
      expect(row.hrPctOfMax).toBeUndefined()
      expect(row.hrKarvonen).toBeUndefined()
    }
  })

  it("reuses each row's own %VMA as the % in the HR formulas, once hrMax is provided", () => {
    const rows = buildPaceMemo(14, 190)
    const ef = rows.find((r) => r.label === 'Endurance / footing')!
    expect(ef.hrPctOfMax).toBe(hrPercentOfMax(190, PCT_VMA.ef))
    expect(ef.hrKarvonen).toBeUndefined() // no hrRest supplied
  })

  it('adds Karvonen once both hrMax and hrRest are provided', () => {
    const rows = buildPaceMemo(14, 190, 55)
    const ef = rows.find((r) => r.label === 'Endurance / footing')!
    expect(ef.hrKarvonen).toBe(hrKarvonen(55, 190, PCT_VMA.ef))
  })
})
