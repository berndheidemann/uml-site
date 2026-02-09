import { ChapterLayout } from '../components/common/ChapterLayout.tsx'
import { TheorySectionComponent } from '../components/common/TheorySection.tsx'
import { InteractiveExample } from '../components/common/InteractiveExample.tsx'
import { ExerciseCard } from '../components/common/ExerciseCard.tsx'
import { HotspotExercise } from '../components/exercises/HotspotExercise.tsx'
import { DragDropExercise } from '../components/exercises/DragDropExercise.tsx'
import { aktivitaetsdiagrammContent } from '../data/content/aktivitaetsdiagramm.ts'
import {
  ablaufDebugger,
  guardZuordner,
  swimlaneSortierer,
} from '../data/exercises/aktivitaetsdiagramm.ts'

function TheorieTab() {
  return <TheorySectionComponent sections={aktivitaetsdiagrammContent.sections} />
}

function BeispielTab() {
  if (!aktivitaetsdiagrammContent.interactiveExample) return null
  const ex = aktivitaetsdiagrammContent.interactiveExample
  return <InteractiveExample title={ex.title} description={ex.description} steps={ex.steps} />
}

function UebungenTab() {
  const total = 3
  return (
    <div className="space-y-6">
      <ExerciseCard index={1} total={total}>
        <HotspotExercise exercise={ablaufDebugger} />
      </ExerciseCard>
      <ExerciseCard index={2} total={total}>
        <DragDropExercise exercise={guardZuordner} />
      </ExerciseCard>
      <ExerciseCard index={3} total={total}>
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
        { id: 'uebungen', label: 'Übungen', content: <UebungenTab /> },
      ]}
    />
  )
}
