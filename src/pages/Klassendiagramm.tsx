import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { UmlDiagram } from '../components/common/UmlDiagram.tsx'
import { DecisionComponent } from '../components/exercises/MultipleChoice.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { ObjectConstellationValidator } from '../components/exercises/ObjectConstellationValidator.tsx'
import { RefactoringChallenge } from '../components/exercises/RefactoringChallenge.tsx'
import { RelationshipExplorer } from '../components/interactive/klassendiagramm/RelationshipExplorer.tsx'
import { RelationshipComparisonCards } from '../components/interactive/klassendiagramm/RelationshipComparisonCards.tsx'
import { klassendiagrammContent } from '../data/content/klassendiagramm.ts'
import {
  kompositionAggregationEntscheider,
  klassenVerteilung,
  beziehungsConnector,
} from '../data/exercises/klassendiagramm.ts'

const introDiagram = `@startuml
class Buch {
  - titel : String
  - isbn : String
  + ausleihen() : void
}
class Autor {
  - name : String
  + getBuecher() : List<Buch>
}
Autor "1..*" -- "1..*" Buch : schreibt >
@enduml`

function TheorieTab() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-text leading-relaxed">
              Stell dir vor, du sollst die Struktur eines Bibliothekssystems beschreiben — welche Dinge gibt es,
              welche Eigenschaften haben sie, und wie haengen sie zusammen? Genau das leistet ein <strong>Klassendiagramm</strong>:
              Es zeigt die Bausteine eines Systems und ihre Beziehungen auf einen Blick.
            </p>
            <p className="text-text-light mt-3 text-sm">
              In diesem Kapitel lernst du, wie Klassen aufgebaut sind, welche Beziehungsarten es gibt und
              wie du Vererbung, Komposition und Aggregation korrekt einsetzt.
            </p>
          </div>
          <div className="flex justify-center">
            <UmlDiagram code={introDiagram} alt="Einfaches Klassendiagramm: Autor schreibt Buch" className="max-w-xs" />
          </div>
        </div>
      </div>
      <TheorySectionComponent sections={klassendiagrammContent.sections} />
    </div>
  )
}

function BeispielTab() {
  if (!klassendiagrammContent.interactiveExample) return null
  const ex = klassendiagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function ErkundenTab() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Was passiert, wenn...?</h2>
        <p className="text-text-light mb-4">Erlebe den Unterschied zwischen Komposition, Aggregation und Assoziation durch Löschen von Objekten.</p>
        <RelationshipExplorer />
      </section>
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Beziehungsarten im Vergleich</h2>
        <p className="text-text-light mb-4">Klicke auf eine Karte, um sie umzudrehen und Details zu sehen.</p>
        <RelationshipComparisonCards />
      </section>
    </div>
  )
}

function UebungenTab() {
  const total = 5
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <ObjectConstellationValidator />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <RefactoringChallenge />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <DragDropExercise exercise={klassenVerteilung} />
      </ExerciseCard>
      <ExerciseCard index={4} total={total}>
        <DragDropExercise exercise={beziehungsConnector} />
      </ExerciseCard>
      <ExerciseCard index={5} total={total}>
        <DecisionComponent exercise={kompositionAggregationEntscheider} />
      </ExerciseCard>
    </div>
  )
}

export default function Klassendiagramm() {
  return (
    <ChapterLayout
      title={klassendiagrammContent.title}
      tabs={[
        { id: 'theorie', label: 'Theorie', content: <TheorieTab /> },
        { id: 'beispiel', label: 'Beispiel', content: <BeispielTab /> },
        { id: 'erkunden', label: 'Erkunden', content: <ErkundenTab /> },
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
