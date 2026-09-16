import { useMemo, useState } from 'react'
import { ExportButtons } from './components/export/ExportButtons'
import { ExplainCards, HouseCards } from './components/education/InfoCards'
import { FoundationDiagram } from './components/education/FoundationDiagram'
import { SettingsForm } from './components/form/SettingsForm'
import { Disclaimer } from './components/layout/Disclaimer'
import { ThemeToggle } from './components/layout/ThemeToggle'
import { PaceMemo } from './components/paces/PaceMemo'
import { WeekDetail } from './components/plan/WeekDetail'
import { WeeklyTable } from './components/plan/WeeklyTable'
import { PlanSummary } from './components/summary/PlanSummary'
import { useSettings } from './hooks/useSettings'
import { useTheme } from './hooks/useTheme'
import { generatePlan } from './lib/planGenerator'

function App() {
  const [settings, setSettings, resetSettings] = useSettings()
  const [theme, setTheme] = useTheme()
  const [selectedWeek, setSelectedWeek] = useState(0)

  const plan = useMemo(() => generatePlan(settings), [settings])

  const handleSelectWeek = (i: number) => {
    setSelectedWeek(i)
  }

  return (
    <div className="mx-auto max-w-[960px] px-5 pb-24">
      <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-6 pt-10">
        <div>
          <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
            Atelier course à pied · Comprendre &amp; construire
          </p>
          <h1 className="mb-1.5 text-[clamp(30px,6vw,48px)] font-extrabold leading-none tracking-tight text-[var(--ink)]">
            Ton atelier <span className="text-[var(--brand)]">plan de course</span>
          </h1>
          <p className="max-w-[64ch] text-[17px] text-[var(--ink-2)]">
            Renseigne ta distance, ton temps dispo et ton délai : le générateur bâtit une trame de semaines avec les
            bonnes allures, les sorties longues et les séances mixtes.
          </p>
        </div>
        <div className="noprint">
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>
      </header>

      <section className="mb-11 mt-8">
        <p className="mb-1 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
          Le générateur
        </p>
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-[var(--ink)]">Construis ton plan</h2>

        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-[var(--shadow)]">
          <SettingsForm settings={settings} onChange={setSettings} onReset={resetSettings} />
          <div className="p-5">
            <PlanSummary plan={plan} />
            <WeeklyTable plan={plan} selectedWeek={selectedWeek} onSelectWeek={handleSelectWeek} />
            <div className="mt-3.5">
              <ExportButtons plan={plan} />
            </div>
          </div>
        </div>

        <div className="mt-4.5">
          <WeekDetail plan={plan} weekIndex={selectedWeek} />
        </div>

        <ExplainCards />
      </section>

      <section className="noprint mb-11">
        <p className="mb-1 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
          La logique du plan
        </p>
        <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--ink)]">
          Comment se construit un programme
        </h2>
        <p className="mb-5 max-w-[68ch] text-[var(--ink-2)]">
          Un plan se bâtit comme une maison : chaque étage repose sur celui du dessous. On ne pose pas le toit avant
          les fondations — chercher la vitesse sans base aérobie, c'est bâtir sur du sable (blessure, plateau).
        </p>
        <FoundationDiagram />
        <HouseCards />
      </section>

      <section className="mb-11">
        <PaceMemo vma={settings.vma} hrMax={settings.hrMax} hrRest={settings.hrRest} />
      </section>

      <Disclaimer />

      <footer className="mt-11 border-t border-[var(--line)] pt-5 text-[13px] text-[var(--muted)]">
        <p>Atelier plan de course — outil de construction, à valider avec ta coach.</p>
      </footer>
    </div>
  )
}

export default App
