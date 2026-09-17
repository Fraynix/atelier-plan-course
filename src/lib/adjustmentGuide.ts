import type { AdjustmentAdvice, DailyState, SessionCategory } from './types'

export interface DailyStateOption {
  value: DailyState
  label: string
  description: string
}

/** Options for the "comment te sens-tu aujourd'hui ?" picker, best to most concerning. */
export const DAILY_STATE_OPTIONS: DailyStateOption[] = [
  { value: 'fresh', label: 'En forme', description: 'Sommeil correct, jambes légères, motivation présente.' },
  {
    value: 'tired',
    label: 'Fatigué·e',
    description: "Sommeil un peu court, jambes lourdes, motivation basse — la fatigue normale d'un bloc d'entraînement.",
  },
  {
    value: 'very_tired',
    label: 'Très fatigué·e / mal fichu·e',
    description: "Épuisement inhabituel, stress élevé, sommeil très dégradé, ou un rhume/mal de gorge qui couve.",
  },
  {
    value: 'niggle',
    label: 'Petite gêne',
    description: "Une gêne musculaire ou articulaire légère (< 3/10), indolore au repos, qui s'estompe à l'échauffement.",
  },
  {
    value: 'pain',
    label: 'Douleur',
    description:
      "Une douleur qui persiste, s'aggrave à l'effort, touche une articulation, ou s'accompagne d'un gonflement ou d'une boiterie.",
  },
]

const SWAP_REDUCE: Record<SessionCategory, string> = {
  long: "Garde la sortie longue mais raccourcis-la d'environ 20–30 % et ralentis l'allure de 30–60 s/km.",
  quality: "Remplace les intervalles par un footing facile, ou fais-en la moitié à l'allure la plus lente prévue.",
  ef: 'Garde le footing mais raccourcis-le de 10 à 15 minutes si besoin.',
  renfo: 'Passe à une version allégée : gainage court + mobilité, sans charge additionnelle.',
  brick: 'Garde uniquement la partie facile (vélo easy) et saute la portion course, ou remplace-la par un footing très facile.',
  bike: 'Roule en endurance (Z2), même si une séance PMA/seuil était prévue.',
  race: 'Un jour de course ne se « réduit » pas : pars plus prudemment que prévu et ajuste ton objectif à la baisse si besoin.',
}

const SWAP_REST: Record<SessionCategory, string> = {
  long: "Repos complet, ou 20 minutes de footing très facile seulement si l'envie est là. Recale la sortie longue plus tard dans la semaine si ton programme le permet.",
  quality: 'Repos complet, ou un footing très facile sans aucune intensité. Les intervalles attendront un jour de meilleure forme.',
  ef: 'Repos complet, ou une marche/footing très court et très facile.',
  renfo: 'Repos complet — pas de renfo aujourd\'hui.',
  brick: 'Repos complet. Saute la brique entière plutôt que de la faire fatigué·e.',
  bike: 'Repos complet, ou un vélo très facile de courte durée si tu préfères bouger un peu.',
  race: "Si l'épuisement ou la maladie s'installe juste avant une course, c'est une vraie décision à peser avec ta coach — mieux vaut repousser un objectif que courir dans un état qui aggrave les choses.",
}

const SWAP_NIGGLE: Record<SessionCategory, string> = {
  long: "Remplace par une sortie plus courte et très facile, ou du vélo/natation en cross-training. Observe la gêne dans les 48h qui suivent.",
  quality: "Saute les intervalles aujourd'hui : fais un footing très facile ou du cross-training sans impact.",
  ef: 'Fais-le en douceur, ou remplace-le par du vélo/natation si la gêne se réveille à la course à pied.',
  renfo: 'Fais uniquement la partie mobilité ; évite les mouvements qui reproduisent la gêne.',
  brick: 'Saute la portion course ; la partie vélo easy reste généralement possible si elle reste indolore.',
  bike: "Vélo facile si ça ne réveille pas la gêne, sinon repos.",
  race: "N'ignore jamais une gêne le jour d'une course : mieux vaut lever le pied ou t'arrêter que t'aggraver une blessure pour un chrono.",
}

const PAIN_SWAP = "Repos complet aujourd'hui ; ne remplace pas par une autre activité tant que tu n'as pas identifié la cause avec un professionnel."

/**
 * Suggests what to do about a planned session given how the runner feels
 * today — a simple, conservative decision aid, not a diagnosis. Always
 * favors backing off over pushing through when in doubt.
 */
export function getAdjustmentAdvice(state: DailyState, category: SessionCategory): AdjustmentAdvice {
  switch (state) {
    case 'fresh':
      return {
        level: 'proceed',
        headline: 'Vas-y comme prévu',
        advice:
          "Ton ressenti est bon : fais la séance prévue, aux allures indiquées. Reste à l'écoute pendant l'échauffement — une gêne qui apparaît change la donne.",
      }
    case 'tired':
      return {
        level: 'reduce',
        headline: 'Réduis, ne saute pas',
        advice:
          "Une fatigue normale de bloc d'entraînement ne justifie pas d'annuler la séance, mais mérite de l'alléger : moins de volume ou d'intensité, pas zéro.",
        swap: SWAP_REDUCE[category],
      }
    case 'very_tired':
      return {
        level: 'rest',
        headline: "Repose-toi aujourd'hui",
        advice:
          "Un épuisement inhabituel, un stress élevé ou une infection qui couve se soignent par le repos, pas par l'entraînement — pousser dans cet état retarde la récupération et augmente le risque de blessure ou de rechute.",
        swap: SWAP_REST[category],
      }
    case 'niggle':
      return {
        level: 'reduce',
        headline: "Prudence, mais pas d'arrêt total",
        advice:
          "Une gêne légère qui disparaît à l'échauffement peut souvent être gérée en adaptant la séance — mais surveille son évolution sur 48h : si elle persiste ou s'aggrave, traite-la comme une douleur.",
        swap: SWAP_NIGGLE[category],
      }
    case 'pain':
      return {
        level: 'seek_care',
        headline: 'Arrête et fais-toi voir',
        advice:
          "Une douleur qui s'aggrave à l'effort, touche une articulation, ou s'accompagne d'un gonflement ou d'une boiterie n'est pas un signal à pousser à travers. Arrête la séance prévue et consulte un professionnel de santé (médecin du sport, kinésithérapeute) avant de reprendre.",
        swap: PAIN_SWAP,
      }
  }
}
