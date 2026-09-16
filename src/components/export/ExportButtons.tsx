import { planToCsv } from '../../lib/csvExport'
import { planToIcs } from '../../lib/icsExport'
import type { Plan } from '../../lib/types'

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const buttonBase =
  'rounded-lg px-5 py-2.5 font-sans text-sm font-extrabold tracking-wide transition-colors'
const primaryButton = buttonBase + ' bg-[var(--brand)] text-white hover:bg-[var(--brand-2)]'
const secondaryButton = buttonBase + ' border-[1.5px] border-[var(--line)] bg-transparent text-[var(--brand-2)]'

export function ExportButtons({ plan }: { plan: Plan }) {
  return (
    <div className="noprint flex flex-wrap items-center gap-2.5">
      <button type="button" className={primaryButton} onClick={() => window.print()}>
        🖨 Imprimer / PDF
      </button>
      <button
        type="button"
        className={secondaryButton}
        onClick={() => downloadFile('plan-course.ics', planToIcs(plan), 'text/calendar;charset=utf-8')}
      >
        Exporter .ics
      </button>
      <button
        type="button"
        className={secondaryButton}
        onClick={() => downloadFile('plan-course.csv', planToCsv(plan), 'text/csv;charset=utf-8')}
      >
        Exporter .csv
      </button>
    </div>
  )
}
