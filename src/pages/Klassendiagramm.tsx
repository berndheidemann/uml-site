import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { DecisionComponent } from '../components/exercises/MultipleChoice.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { klassendiagrammContent } from '../data/content/klassendiagramm.ts'
import {
  kompositionAggregationEntscheider,
  multiplizitaetenEditor,
  klassenVerteilung,
  beziehungsConnector,
} from '../data/exercises/klassendiagramm.ts'

function TheorieTab() {
  return <TheorySectionComponent sections={klassendiagrammContent.sections} />
}

function BeispielTab() {
  if (!klassendiagrammContent.interactiveExample) return null
  const ex = klassendiagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function UebungenTab() {
  const total = 4
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <DecisionComponent exercise={kompositionAggregationEntscheider} />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <DragDropExercise exercise={multiplizitaetenEditor} />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <DragDropExercise exercise={klassenVerteilung} />
      </ExerciseCard>
      <ExerciseCard index={4} total={total}>
        <DragDropExercise exercise={beziehungsConnector} />
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
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
