import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { UmlDiagram } from '../components/common/UmlDiagram.tsx'
import { MultipleChoiceComponent } from '../components/exercises/MultipleChoice.tsx'
import { TextExtractionExercise } from '../components/exercises/TextExtractionExercise.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { StakeholderInterview } from '../components/exercises/StakeholderInterview.tsx'
import { PersonaCards } from '../components/interactive/usecasediagramm/PersonaCards.tsx'
import { IncludeExtendDecisionTree } from '../components/interactive/usecasediagramm/IncludeExtendDecisionTree.tsx'
import { usecasediagrammContent } from '../data/content/usecasediagramm.ts'
import {
  includeExtendSortierer,
  anforderungsExtraktor,
  systemgrenzeDebatte,
} from '../data/exercises/usecasediagramm.ts'

const introDiagram = `@startuml
left to right direction
actor Kunde
rectangle "Online-Bibliothek" {
  usecase "Buch suchen" as UC1
  usecase "Buch ausleihen" as UC2
}
Kunde -- UC1
Kunde -- UC2
@enduml`

function TheorieTab() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-text leading-relaxed">
              Bevor man programmiert, muss man verstehen: Was soll das System ueberhaupt koennen — und fuer wen?
              Das <strong>Use-Case-Diagramm</strong> zeigt die Funktionalitaet eines Systems aus der Perspektive
              seiner Benutzer, ohne sich um technische Details zu kuemmern.
            </p>
            <p className="text-text-light mt-3 text-sm">
              In diesem Kapitel lernst du Akteure, Anwendungsfaelle, Systemgrenzen sowie
              die Beziehungsarten include und extend.
            </p>
          </div>
          <div className="flex justify-center">
            <UmlDiagram code={introDiagram} alt="Einfaches Use-Case-Diagramm: Kunde nutzt Online-Bibliothek" className="max-w-xs" />
          </div>
        </div>
      </div>
      <TheorySectionComponent sections={usecasediagrammContent.sections} />
    </div>
  )
}

function BeispielTab() {
  if (!usecasediagrammContent.interactiveExample) return null
  const ex = usecasediagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function ErkundenTab() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">Persona-Karten</h2>
        <p className="text-text-light mb-4">Klicke auf einen Akteur, um seine Use Cases im Diagramm hervorzuheben.</p>
        <PersonaCards />
      </section>
      <section>
        <h2 className="text-2xl font-bold text-text mb-2">include oder extend?</h2>
        <p className="text-text-light mb-4">Der Entscheidungsbaum hilft dir, die richtige Beziehungsart zu bestimmen.</p>
        <IncludeExtendDecisionTree />
      </section>
    </div>
  )
}

function UebungenTab() {
  const total = 4
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <StakeholderInterview />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <TextExtractionExercise exercise={anforderungsExtraktor} />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <DragDropExercise exercise={systemgrenzeDebatte} />
      </ExerciseCard>
      <ExerciseCard index={4} total={total}>
        <MultipleChoiceComponent exercise={includeExtendSortierer} />
      </ExerciseCard>
    </div>
  )
}

export default function UseCaseDiagramm() {
  return (
    <ChapterLayout
      title={usecasediagrammContent.title}
      tabs={[
        { id: 'theorie', label: 'Theorie', content: <TheorieTab /> },
        { id: 'beispiel', label: 'Beispiel', content: <BeispielTab /> },
        { id: 'erkunden', label: 'Erkunden', content: <ErkundenTab /> },
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
