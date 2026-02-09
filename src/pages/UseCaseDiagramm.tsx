import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { MultipleChoiceComponent } from '../components/exercises/MultipleChoice.tsx'
import { TextExtractionExercise } from '../components/exercises/TextExtractionExercise.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { usecasediagrammContent } from '../data/content/usecasediagramm.ts'
import {
  includeExtendSortierer,
  anforderungsExtraktor,
  systemgrenzeDebatte,
} from '../data/exercises/usecasediagramm.ts'

function TheorieTab() {
  return <TheorySectionComponent sections={usecasediagrammContent.sections} />
}

function BeispielTab() {
  if (!usecasediagrammContent.interactiveExample) return null
  const ex = usecasediagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function UebungenTab() {
  const total = 3
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <MultipleChoiceComponent exercise={includeExtendSortierer} />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <TextExtractionExercise exercise={anforderungsExtraktor} />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
        <DragDropExercise exercise={systemgrenzeDebatte} />
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
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
