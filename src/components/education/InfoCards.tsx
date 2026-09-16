const HOUSE_CARDS = [
  {
    title: '① Les fondations — la base',
    body: (
      <>
        La plus grosse partie du temps : <b className="font-bold text-[var(--ink)]">endurance fondamentale</b>,
        volume progressif, sorties longues. Elle développe le moteur aérobie sur lequel tout le reste s'appuie.
        Large et solide, sinon rien ne tient au-dessus.
      </>
    ),
  },
  {
    title: '② Les murs — le spécifique',
    body: (
      <>
        Une fois la base posée, on érige le <b className="font-bold text-[var(--ink)]">travail spécifique</b> : seuil
        et allure de course, sortie longue mixte. C'est ce qui donne sa forme à la maison — la performance visée.
      </>
    ),
  },
  {
    title: '③ Le toit — l\'affûtage',
    body: (
      <>
        En dernier seulement : on réduit le volume pour{' '}
        <b className="font-bold text-[var(--ink)]">éliminer la fatigue</b> et révéler la forme le jour J. Poser le
        toit trop tôt (affûter avant d'avoir construit) ne sert à rien.
      </>
    ),
  },
  {
    title: 'Le mortier — renfo & récup',
    body: (
      <>
        Le <b className="font-bold text-[var(--ink)]">renforcement</b> et les{' '}
        <b className="font-bold text-[var(--ink)]">semaines d'assimilation</b> lient l'ensemble et évitent les
        fissures (blessures). Invisibles mais structurels : on ne les zappe pas.
      </>
    ),
  },
]

export function HouseCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {HOUSE_CARDS.map((card) => (
        <div key={card.title} className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-4.5 shadow-[var(--shadow)]">
          <h4 className="mb-1.5 font-sans text-[15px] font-extrabold text-[var(--ink)]">{card.title}</h4>
          <p className="text-[13.5px] text-[var(--ink-2)]">{card.body}</p>
        </div>
      ))}
    </div>
  )
}

const EXPLAIN_CARDS = [
  {
    title: 'Comment lire ton plan',
    borderClass: 'border-t-[var(--brand)]',
    body: (
      <>
        Chaque semaine combine <b className="font-bold text-[var(--ink)]">une sortie longue</b>,{' '}
        <b className="font-bold text-[var(--ink)]">une séance de qualité</b> (VMA puis seuil), des{' '}
        <b className="font-bold text-[var(--ink)]">footings faciles</b> et un{' '}
        <b className="font-bold text-[var(--ink)]">renfo</b>. On progresse 2–3 semaines, puis une{' '}
        <b className="font-bold text-[var(--ink)]">semaine d'assimilation</b> allégée laisse le corps se reconstruire
        plus fort. Plus la course approche, plus les séances{' '}
        <b className="font-bold text-[var(--ink)]">ressemblent à l'objectif</b> (allure spécifique, sortie longue
        mixte).
      </>
    ),
  },
  {
    title: 'Pourquoi le renfo est obligatoire',
    borderClass: 'border-t-[var(--violet)]',
    body: (
      <>
        30 min par semaine, non négociables : le renforcement <b className="font-bold text-[var(--ink)]">prévient les blessures</b> (le
        premier facteur d'échec d'une prépa) en solidifiant tendons, hanches et chaîne postérieure. Il{' '}
        <b className="font-bold text-[var(--ink)]">évolue avec l'échéance</b> : force générale au début, prévention
        &amp; pliométrie légère en phase spécifique, gainage/mobilité en affûtage pour ne créer aucune fatigue.
      </>
    ),
  },
  {
    title: 'Pourquoi les enchaînements (briques) comptent',
    borderClass: 'border-t-[var(--brick)]',
    body: (
      <>
        La « brique » = enchaîner <b className="font-bold text-[var(--ink)]">vélo puis course</b> sans pause. C'est{' '}
        <b className="font-bold text-[var(--ink)]">spécifique au triathlon</b> : elle apprend à tes jambes à courir
        sur la fatigue du vélo, entraîne la transition neuromusculaire, et ajoute du{' '}
        <b className="font-bold text-[var(--ink)]">volume aérobie sans le traumatisme</b> de la course seule. On la
        rapproche du réel à l'approche de la course, puis on l'allège pendant l'affûtage.
      </>
    ),
  },
]

export function ExplainCards() {
  return (
    <div className="noprint mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
      {EXPLAIN_CARDS.map((card) => (
        <div
          key={card.title}
          className={`rounded-[14px] border border-[var(--line)] border-t-[3px] bg-[var(--panel)] p-4 shadow-[var(--shadow)] ${card.borderClass}`}
        >
          <h3 className="mb-1.5 font-sans text-[15px] font-extrabold text-[var(--ink)]">{card.title}</h3>
          <p className="text-[13.5px] text-[var(--ink-2)]">{card.body}</p>
        </div>
      ))}
    </div>
  )
}
