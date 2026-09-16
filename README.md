# Atelier plan de course

Générateur de plan d'entraînement course à pied (et vélo pour les triathlètes),
personnalisé à partir de la VMA et du temps disponible. 100 % front, sans
backend, installable en PWA.

Prototype de référence (comportement source de vérité) : [reference/atelier-plan-course.html](reference/atelier-plan-course.html).

## Stack

React + TypeScript + Vite, Tailwind CSS v4, Vitest.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Tests

```bash
npm test          # une passe
npm run test:watch
npm run test:ui
```

## Build de production

```bash
npm run build
npm run preview
```

## Structure

- `src/lib/` — logique métier pure (formules, périodisation, génération du plan,
  export). Aucune dépendance React ; entièrement testée par Vitest.
- `src/components/` — UI, découpée par écran (formulaire, résumé, tableau
  hebdomadaire, détail semaine, pédagogie, mémo d'allures, export).
- `src/hooks/` — persistance des réglages (localStorage) et thème clair/sombre.
- `tests/` — tests Vitest miroir de `src/lib/`.

## Avertissement

Outil d'aide à la construction d'un plan, à adapter à tes sensations et à
valider avec un coach. Ne remplace pas un avis professionnel, surtout en cas
de fatigue persistante ou de douleur.
