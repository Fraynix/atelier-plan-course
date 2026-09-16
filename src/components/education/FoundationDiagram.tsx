/**
 * The "house" schema: fondations (base aérobie) → murs (spécifique) → toit
 * (affûtage), with renfo/récup as the mortar holding it together. Colors are
 * CSS custom properties so the diagram follows the light/dark theme exactly
 * like the rest of the UI — modern browsers resolve var() in SVG
 * presentation attributes through the normal CSS cascade.
 */
export function FoundationDiagram() {
  return (
    <figure className="my-1.5 mb-4.5">
      <svg
        viewBox="0 0 720 470"
        role="img"
        aria-label="Le programme construit comme une maison : fondations (base aérobie), murs (travail spécifique), toit (affûtage), tenus par le mortier du renfo et de la récupération."
        className="mx-auto block h-auto w-full max-w-[640px] text-[var(--ink-2)]"
      >
        <defs>
          <marker id="up" markerWidth={9} markerHeight={9} refX={4.5} refY={7} orient="auto">
            <polygon points="4.5,0 9,9 0,9" fill="currentColor" />
          </marker>
        </defs>
        <line x1={70} y1={300} x2={650} y2={300} stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.5} />
        <rect
          x={180}
          y={300}
          width={360}
          height={46}
          rx={4}
          fill="var(--panel-3)"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeDasharray="4 3"
        />
        <text x={360} y={328} textAnchor="middle" fontSize={13} fontFamily="Archivo, sans-serif" fontWeight={700} fill="currentColor">
          Reprise &amp; base
        </text>
        <rect x={200} y={250} width={320} height={50} rx={3} fill="var(--brand-2)" />
        <text x={360} y={280} textAnchor="middle" fontSize={13} fontFamily="Archivo, sans-serif" fontWeight={700} fill="#ffffff">
          Fondation — endurance &amp; volume
        </text>
        <rect x={225} y={196} width={270} height={54} rx={3} fill="var(--brand)" />
        <text x={360} y={227} textAnchor="middle" fontSize={13} fontFamily="Archivo, sans-serif" fontWeight={700} fill="#ffffff">
          Spécifique — seuil &amp; allure
        </text>
        <polygon points="212,196 508,196 360,120" fill="var(--accent)" />
        <text x={360} y={176} textAnchor="middle" fontSize={13} fontFamily="Archivo, sans-serif" fontWeight={800} fill="#ffffff">
          Affûtage
        </text>
        <text x={360} y={364} textAnchor="middle" fontSize={11.5} fontFamily="Archivo, sans-serif" fill="currentColor" opacity={0.75}>
          Ton niveau de départ (test VMA)
        </text>
        <path d="M150,120 L142,120 L142,346 L150,346" fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
        <text
          x={126}
          y={233}
          textAnchor="middle"
          fontSize={11.5}
          fontFamily="Archivo, sans-serif"
          fontWeight={700}
          fill="currentColor"
          transform="rotate(-90 126 233)"
        >
          RENFO + RÉCUP
        </text>
        <line x1={578} y1={346} x2={578} y2={128} stroke="currentColor" strokeOpacity={0.6} strokeWidth={1.5} markerEnd="url(#up)" />
        <text
          x={596}
          y={237}
          textAnchor="middle"
          fontSize={11.5}
          fontFamily="Archivo, sans-serif"
          fill="currentColor"
          opacity={0.8}
          transform="rotate(-90 596 237)"
        >
          on construit de bas en haut
        </text>
      </svg>
      <figcaption className="mx-auto mt-2 max-w-[60ch] text-center text-[13px] text-[var(--muted)]">
        On bâtit de bas en haut : d'abord la <b className="font-semibold text-[var(--ink-2)]">base aérobie</b>{' '}
        (volume, endurance), puis le <b className="font-semibold text-[var(--ink-2)]">travail spécifique</b> (seuil,
        allure de course), et seulement au sommet l'<b className="font-semibold text-[var(--ink-2)]">affûtage</b> qui
        révèle la forme le jour J. Le <b className="font-semibold text-[var(--ink-2)]">renfo</b> et la{' '}
        <b className="font-semibold text-[var(--ink-2)]">récupération</b> (semaines d'assimilation) sont le mortier :
        sans eux, la maison se fissure — blessure ou plateau.
      </figcaption>
    </figure>
  )
}
