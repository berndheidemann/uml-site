import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { UmlDiagram } from '../components/common/UmlDiagram.tsx'
import { HotspotExercise } from '../components/exercises/HotspotExercise.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { ParallelityOptimizer } from '../components/exercises/ParallelityOptimizer.tsx'
import { GuardCompletenessChecker } from '../components/exercises/GuardCompletenessChecker.tsx'
import { ProcessTokenAnimator } from '../components/interactive/aktivitaetsdiagramm/ProcessTokenAnimator.tsx'
import { PseudocodeMapping } from '../components/interactive/aktivitaetsdiagramm/PseudocodeMapping.tsx'
import { aktivitaetsdiagrammContent } from '../data/content/aktivitaetsdiagramm.ts'
import {
  ablaufDebugger,
  guardZuordner,
  swimlaneSortierer,
} from '../data/exercises/aktivitaetsdiagramm.ts'

const introDiagram = `@startuml
start
:Kaffee kochen;
if (Milch vorhanden?) then (ja)
  :Milch hinzufuegen;
else (nein)
  :Schwarz trinken;
endif
stop
@enduml`

function TheorieTab() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl border border-purple-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-text leading-relaxed">
              Wie beschreibst du den Ablauf eines Algorithmus oder eines Geschaeftsprozesses? Das
              <strong> Aktivitaetsdiagramm</strong> zeigt Schritt fuer Schritt, was passiert — inklusive
              Verzweigungen, paralleler Ablaeufe und Schleifen. Es ist das UML-Aequivalent eines Flussdiagramms,
              aber mit deutlich mehr Ausdruckskraft.
            </p>
            <p className="text-text-light mt-3 text-sm">
              In diesem Kapitel lernst du Aktionen, Entscheidungsknoten, Parallelisierung mit Fork/Join
              und Swimlanes fuer die Zuordnung zu Verantwortungsbereichen.
            </p>
          </div>
          <div className="flex justify-center">
            <UmlDiagram code={introDiagram} alt="Einfaches Aktivitaetsdiagramm: Kaffee kochen mit Entscheidung" className="max-w-xs" />
          </div>
        </div>
      </div>
      <TheorySectionComponent sections={aktivitaetsdiagrammContent.sections} />
    </div>
  )
}

function BeispielTab() {
  if (!aktivitaetsdiagrammContent.interactiveExample) return null
  const ex = aktivitaetsdiagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function ErkundenTab() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Prozess-Animator (Token-Game)</h2>
        <p className="text-text-light mb-4">Steuere einen Token durch das Aktivitätsdiagramm und triff Entscheidungen an Verzweigungen.</p>
        <ProcessTokenAnimator />
      </section>
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Pseudocode-Mapping</h2>
        <p className="text-text-light mb-4">Sieh die Verbindung zwischen Pseudocode und Aktivitätsdiagramm.</p>
        <PseudocodeMapping />
      </section>
    </div>
  )
}

function UebungenTab() {
  const total = 5
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <ParallelityOptimizer />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <GuardCompletenessChecker />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <HotspotExercise exercise={ablaufDebugger} />
      </ExerciseCard>
      <ExerciseCard index={4} total={total}>
        <DragDropExercise exercise={guardZuordner} />
      </ExerciseCard>
      <ExerciseCard index={5} total={total}>
        <DragDropExercise exercise={swimlaneSortierer} />
      </ExerciseCard>
    </div>
  )
}

export default function Aktivitaetsdiagramm() {
  return (
    <ChapterLayout
      title={aktivitaetsdiagrammContent.title}
      tabs={[
        { id: 'theorie', label: 'Theorie', content: <TheorieTab /> },
        { id: 'beispiel', label: 'Beispiel', content: <BeispielTab /> },
        { id: 'erkunden', label: 'Erkunden', content: <ErkundenTab /> },
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
