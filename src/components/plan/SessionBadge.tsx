import type { SessionCategory } from '../../lib/types'

export const CATEGORY_LABEL: Record<SessionCategory, string> = {
  long: 'Sortie longue',
  quality: 'Qualité',
  ef: 'Footing',
  renfo: 'Renfo',
  brick: 'Brique',
  bike: 'Vélo',
  race: 'Course',
}

const CATEGORY_CLASS: Record<SessionCategory, string> = {
  long: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  quality: 'bg-[var(--info-soft)] text-[var(--info)]',
  ef: 'bg-[var(--brand-soft)] text-[var(--brand-2)]',
  renfo: 'bg-[var(--violet-soft)] text-[var(--violet)]',
  brick: 'bg-[var(--brick-soft)] text-[var(--brick)]',
  bike: 'bg-[var(--bike-soft)] text-[var(--bike)]',
  race: 'bg-[var(--brand)] text-white',
}

export function SessionBadge({ category, className = '' }: { category: SessionCategory; className?: string }) {
  return (
    <span
      className={
        'inline-block shrink-0 rounded-md px-1.5 py-1 text-center font-sans text-[9.5px] font-extrabold uppercase tracking-wide ' +
        CATEGORY_CLASS[category] +
        ' ' +
        className
      }
    >
      {CATEGORY_LABEL[category]}
    </span>
  )
}
