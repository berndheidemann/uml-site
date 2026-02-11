import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { UmlDiagram } from '../components/common/UmlDiagram.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { GuardEvaluatorComponent } from '../components/exercises/zustandsdiagramm/GuardEvaluator.tsx'
import { ZustandsautomatSimulator } from '../components/exercises/zustandsdiagramm/ZustandsautomatSimulator.tsx'
import { StateSequenceReconstruction } from '../components/exercises/StateSequenceReconstruction.tsx'
import { StateMachineDuel } from '../components/exercises/StateMachineDuel.tsx'
import { VendingMachineAnalogy } from '../components/interactive/zustandsdiagramm/VendingMachineAnalogy.tsx'
import { zustandsdiagrammContent } from '../data/content/zustandsdiagramm.ts'
import {
  entryExitZuordner,
  guardEvaluator,
  zustandsautomatSimulator,
} from '../data/exercises/zustandsdiagramm.ts'

const introDiagram = `@startuml
[*] --> Rot
Rot --> Gruen : timer_abgelaufen
Gruen --> Gelb : timer_abgelaufen
Gelb --> Rot : timer_abgelaufen
@enduml`

function TheorieTab() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-text leading-relaxed">
              Denke an eine Ampel: Sie wechselt zwischen Rot, Gelb und Gruen — aber nie zufaellig, sondern nach
              festen Regeln. <strong>Zustandsdiagramme</strong> beschreiben genau solche Verhaltensweisen: Welche Zustaende
              kann ein Objekt annehmen, und welche Ereignisse loesen Uebergaenge aus?
            </p>
            <p className="text-text-light mt-3 text-sm">
              In diesem Kapitel lernst du Zustaende, Transitionen, Guards, Entry/Do/Exit-Aktionen
              und wie du den Lebenszyklus von Objekten modellierst.
            </p>
          </div>
          <div className="flex justify-center">
            <UmlDiagram code={introDiagram} alt="Einfaches Zustandsdiagramm: Ampel mit Zustaenden Rot, Gruen, Gelb" className="max-w-xs" />
          </div>
        </div>
      </div>
      <TheorySectionComponent sections={zustandsdiagrammContent.sections} />
    </div>
  )
}

function BeispielTab() {
  if (!zustandsdiagrammContent.interactiveExample) return null
  const ex = zustandsdiagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function ErkundenTab() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Alltagsbeispiel: Getränkeautomat</h2>
        <p className="text-text-light mb-4">Bediene den Automaten und beobachte die Zustandsübergänge live.</p>
        <VendingMachineAnalogy />
      </section>
    </div>
  )
}

function UebungenTab() {
  const total = 5
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <StateMachineDuel />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <ZustandsautomatSimulator exercise={zustandsautomatSimulator} />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <StateSequenceReconstruction />
      </ExerciseCard>
      <ExerciseCard index={4} total={total}>
        <GuardEvaluatorComponent exercise={guardEvaluator} />
      </ExerciseCard>
      <ExerciseCard index={5} total={total}>
        <DragDropExercise exercise={entryExitZuordner} />
      </ExerciseCard>
    </div>
  )
}

export default function Zustandsdiagramm() {
  return (
    <ChapterLayout
      title={zustandsdiagrammContent.title}
      tabs={[
        { id: 'theorie', label: 'Theorie', content: <TheorieTab /> },
        { id: 'beispiel', label: 'Beispiel', content: <BeispielTab /> },
        { id: 'erkunden', label: 'Erkunden', content: <ErkundenTab /> },
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
