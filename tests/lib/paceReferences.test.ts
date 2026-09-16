import { describe, expect, it } from 'vitest'
import { buildPaceMemo } from '../../src/lib/paceReferences'
import { paceLabel } from '../../src/lib/formulas'

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
})
