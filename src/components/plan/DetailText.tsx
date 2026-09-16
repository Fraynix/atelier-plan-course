import type { DetailSegment } from '../../lib/types'

/** Renders a session's rich-text detail (bold/muted segments) without dangerouslySetInnerHTML. */
export function DetailText({ segments }: { segments: DetailSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        const className = [seg.strong ? 'font-bold text-[var(--ink)]' : '', seg.muted ? 'text-[var(--muted)]' : '']
          .filter(Boolean)
          .join(' ')
        return className ? (
          <span key={i} className={className}>
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      })}
    </>
  )
}
