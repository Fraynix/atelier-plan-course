const FORMULA_CARDS = [
  {
    title: '① Vitesse cible',
    body: 'On choisit une intensité en % de VMA, ce qui donne une vitesse en km/h.',
    formula: 'vitesse = VMA × %',
    example: 'ex. 14 × 0,85 = 11,9 km/h',
    why: "chaque % correspond à une zone physiologique (endurance, seuil, VMA). Piloter en % rend les allures transposables quand ta VMA progresse.",
  },
  {
    title: '② Allure au km',
    body: 'On convertit la vitesse (km/h) en allure (min/km).',
    formula: 'allure = 3600 ÷ vitesse (en secondes)',
    example: '3600 / 11,9 ≈ 303 s → 5:03/km',
    why: "60 min dans une heure ; à 11,9 km/h tu couvres 1 km en 1/11,9 d'heure. On convertit cette fraction d'heure en secondes.",
  },
  {
    title: '③ Temps sur une distance',
    body: 'Pour le fractionné sur piste : le temps que dure une répétition.',
    formula: 'temps (s) = distance (m) × 3,6 ÷ vitesse',
    example: '400 m → 1440 ÷ vitesse · 1000 m → 3600 ÷ vitesse',
    why: 'la vitesse en m/s = km/h ÷ 3,6 ; le temps = distance ÷ vitesse. Le « ×3,6 » fait le pont entre km/h et m/s.',
  },
  {
    title: "④ Distance d'une répétition en temps",
    body: 'Pour une séance type 30/30 : la distance couverte pendant un bloc chronométré.',
    formula: 'distance (m) = vitesse ÷ 3,6 × durée (s)',
    example: 'à 14,7 km/h (105 %), en 30 s tu parcours ≈ 122 m',
    why: "l'inverse de la formule ③ — utile pour visualiser la distance d'un 30/30 sans regarder sa montre.",
  },
]

export function FormulaCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {FORMULA_CARDS.map((card) => (
        <div key={card.title} className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-4.5 shadow-[var(--shadow)]">
          <h3 className="mb-1.5 font-sans text-[15px] font-extrabold text-[var(--ink)]">{card.title}</h3>
          <p className="mb-2 text-[13.5px] text-[var(--ink-2)]">{card.body}</p>
          <code className="mb-1 block rounded-md border-l-[3px] border-[var(--brand)] bg-[var(--panel-3)] px-3 py-2 font-mono text-[13px] text-[var(--code)]">
            {card.formula}
            <span className="ml-2 text-[var(--muted)]">{card.example}</span>
          </code>
          <p className="mt-2 text-[13px] text-[var(--muted)]">
            <b className="font-semibold text-[var(--ink-2)]">Pourquoi : </b>
            {card.why}
          </p>
        </div>
      ))}
    </div>
  )
}

const SESSION_TYPE_CARDS = [
  {
    badgeClass: 'bg-[var(--brand-soft)] text-[var(--brand-2)]',
    title: 'Footing (endurance fondamentale)',
    what: 'Course continue à allure très facile (65–72 % VMA), en aisance respiratoire — tu peux tenir une conversation.',
    why: "construit le moteur aérobie (capillarisation, mitochondries, économie de course) sans accumuler de fatigue. C'est le volume qui rend le reste possible.",
  },
  {
    badgeClass: 'bg-[var(--accent-soft)] text-[var(--accent)]',
    title: 'Sortie longue',
    what: 'Course continue plus longue, à allure facile à modérée (68–75 % VMA), qui progresse semaine après semaine vers un pic.',
    why: "habitue le corps à l'effort prolongé — gestion des réserves d'énergie, résistance mentale, adaptation musculo-tendineuse. En phase spécifique, elle devient « mixte » pour se rapprocher de l'allure de course.",
  },
  {
    badgeClass: 'bg-[var(--info-soft)] text-[var(--info)]',
    title: 'Qualité — VMA',
    what: 'Fractionné court et rapide (30/30, 400 m) à 95–105 % de la VMA, en phase fondation.',
    why: "élève ton plafond de vitesse maximale aérobie. Comme toutes les autres allures se calent en % de la VMA, la faire progresser fait progresser tout le reste.",
  },
  {
    badgeClass: 'bg-[var(--info-soft)] text-[var(--info)]',
    title: 'Qualité — Seuil',
    what: 'Blocs plus longs (8 min, 1000–2000 m) à 88–90 % VMA, récupération courte, en phase spécifique.',
    why: "repousse le point où l'acide lactique s'accumule plus vite qu'il n'est éliminé — la qualité la plus rentable pour les distances du 10 km au marathon.",
  },
  {
    badgeClass: 'bg-[var(--violet-soft)] text-[var(--violet)]',
    title: 'Renfo',
    what: 'Gainage, squats/fentes, chaîne postérieure — puis pliométrie légère en spécifique, puis mobilité seule à l\'approche de la course.',
    why: "le premier facteur d'échec d'une prépa est la blessure, pas le manque de vitesse. Le renfo solidifie tendons et articulations pour absorber le volume qui monte.",
  },
  {
    badgeClass: 'bg-[var(--brick-soft)] text-[var(--brick)]',
    title: 'Brique (vélo → course)',
    what: 'Enchaînement vélo puis course, sans pause entre les deux.',
    why: "spécifique au triathlon : entraîne la transition neuromusculaire et ajoute du volume aérobie sans le traumatisme de l'impact au sol de la course seule.",
  },
  {
    badgeClass: 'bg-[var(--bike-soft)] text-[var(--bike)]',
    title: 'Vélo',
    what: 'Endurance (Z2, durée + ressenti) ou PMA/seuil (intervalles en durée + ressenti) — jamais en watts/FTP ici.',
    why: 'du volume aérobie supplémentaire sans le coût articulaire de la course — utile pour absorber plus d\'heures sans se blesser, en solo ou en préparation triathlon.',
  },
]

export function SessionTypeCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SESSION_TYPE_CARDS.map((card) => (
        <div key={card.title} className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-4.5 shadow-[var(--shadow)]">
          <span className={`mb-2 inline-block rounded-md px-2 py-1 font-sans text-[9.5px] font-extrabold uppercase tracking-wide ${card.badgeClass}`}>
            {card.title}
          </span>
          <p className="mb-2 text-[13.5px] text-[var(--ink-2)]">{card.what}</p>
          <p className="text-[13px] text-[var(--muted)]">
            <b className="font-semibold text-[var(--ink-2)]">Pourquoi : </b>
            {card.why}
          </p>
        </div>
      ))}
    </div>
  )
}
