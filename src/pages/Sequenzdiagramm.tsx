import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { UmlDiagram } from '../components/common/UmlDiagram.tsx'
import { TimedChallenge } from '../components/exercises/TimedChallenge.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { CodeTraceSequence } from '../components/exercises/CodeTraceSequence.tsx'
import { FragmentWrapperExercise } from '../components/exercises/FragmentWrapperExercise.tsx'
import { MessageFlowAnimator } from '../components/interactive/sequenzdiagramm/MessageFlowAnimator.tsx'
import { SyncAsyncComparison } from '../components/interactive/sequenzdiagramm/SyncAsyncComparison.tsx'
import { FragmentAnimator } from '../components/interactive/sequenzdiagramm/FragmentAnimator.tsx'
import { sequenzdiagrammContent } from '../data/content/sequenzdiagramm.ts'
import {
  nachrichtenTypSchnelltrainer,
  rueckantwortVervollstaendiger,
  szenarioZuSequenzBuilder,
  reihenfolgePuzzle,
} from '../data/exercises/sequenzdiagramm.ts'

const introDiagram = `@startuml
actor Nutzer
participant App
participant Server

Nutzer -> App : Nachricht eingeben
activate App
App -> Server : sende(nachricht)
activate Server
Server --> App : OK
deactivate Server
App --> Nutzer : Bestaetigung anzeigen
deactivate App
@enduml`

function TheorieTab() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-text leading-relaxed">
              Was passiert eigentlich genau, wenn du in einer App auf „Senden" klickst? Welche Nachrichten werden
              zwischen welchen Beteiligten ausgetauscht? Das <strong>Sequenzdiagramm</strong> macht diese unsichtbaren
              Ablaeufe sichtbar — Nachricht fuer Nachricht, in zeitlicher Reihenfolge.
            </p>
            <p className="text-text-light mt-3 text-sm">
              In diesem Kapitel lernst du die Notation fuer Lebenslinien, synchrone und asynchrone Nachrichten,
              Aktivierungsbalken und kombinierte Fragmente wie loop, alt und opt.
            </p>
          </div>
          <div className="flex justify-center">
            <UmlDiagram code={introDiagram} alt="Einfaches Sequenzdiagramm: Nutzer sendet Nachricht ueber App an Server" className="max-w-xs" />
          </div>
        </div>
      </div>
      <TheorySectionComponent sections={sequenzdiagrammContent.sections} />
    </div>
  )
}

function BeispielTab() {
  if (!sequenzdiagrammContent.interactiveExample) return null
  const ex = sequenzdiagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function ErkundenTab() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Animierter Nachrichtenfluss</h2>
        <p className="text-text-light mb-4">Beobachte, wie Nachrichten zwischen den Lebenslinien fließen.</p>
        <MessageFlowAnimator />
      </section>
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Synchron vs. Asynchron</h2>
        <p className="text-text-light mb-4">Vergleiche synchrone und asynchrone Kommunikation im direkten Vergleich.</p>
        <SyncAsyncComparison />
      </section>
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Kombinierte Fragmente: Loop &amp; Alt</h2>
        <p className="text-text-light mb-4">Beobachte schrittweise, wie loop- und alt-Fragmente ein Sequenzdiagramm strukturieren.</p>
        <FragmentAnimator />
      </section>
    </div>
  )
}

function UebungenTab() {
  const total = 6
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <CodeTraceSequence />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <FragmentWrapperExercise />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <TimedChallenge exercise={nachrichtenTypSchnelltrainer} />
      </ExerciseCard>
      <ExerciseCard index={4} total={total}>
        <DragDropExercise exercise={reihenfolgePuzzle} />
      </ExerciseCard>
      <ExerciseCard index={5} total={total}>
        <DragDropExercise exercise={rueckantwortVervollstaendiger} />
      </ExerciseCard>
      <ExerciseCard index={6} total={total}>
        <DragDropExercise exercise={szenarioZuSequenzBuilder} />
      </ExerciseCard>
    </div>
  )
}

export default function Sequenzdiagramm() {
  return (
    <ChapterLayout
      title={sequenzdiagrammContent.title}
      tabs={[
        { id: 'theorie', label: 'Theorie', content: <TheorieTab /> },
        { id: 'beispiel', label: 'Beispiel', content: <BeispielTab /> },
        { id: 'erkunden', label: 'Erkunden', content: <ErkundenTab /> },
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
